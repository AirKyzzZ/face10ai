import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, TIER_CREDITS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    // Return 200 to prevent Stripe from retrying indefinitely.
    // The error is logged for investigation but acknowledged to Stripe.
    return NextResponse.json({ received: true, error: 'Handler failed' })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const tier = session.metadata?.tier as 'PRO' | 'PREMIUM'
  const billingPeriod = (session.metadata?.billingPeriod as 'monthly' | 'annual') || 'monthly'
  
  if (!userId || !tier) {
    console.error('Missing metadata in checkout session')
    return
  }

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Calculate credits reset date based on billing period (UTC)
  const now = Date.now()
  const creditsResetAt = billingPeriod === 'annual'
    ? new Date(now + 365 * 24 * 60 * 60 * 1000)
    : new Date(now + 30 * 24 * 60 * 60 * 1000)

  // Update user with subscription info and grant credits
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStartDate: new Date(),
        creditsRemaining: TIER_CREDITS[tier],
        creditsResetAt,
      },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount: TIER_CREDITS[tier],
        type: 'subscription',
        description: `${tier} credits - New subscription`,
      },
    }),
  ])
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Get subscription ID from invoice (handle both string and object cases)
  const invoiceWithSub = invoice as Stripe.Invoice & { subscription?: string | { id: string } | null }
  const subscriptionId = typeof invoiceWithSub.subscription === 'string'
    ? invoiceWithSub.subscription
    : invoiceWithSub.subscription?.id

  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const customerId = subscription.customer as string

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Check if this is a renewal (not the first payment)
  const isRenewal = invoice.billing_reason === 'subscription_cycle'
  
  if (isRenewal) {
    // Reset credits based on subscription interval (UTC)
    const tier = user.subscriptionTier as 'PRO' | 'PREMIUM'
    const renewalNow = Date.now()
    const interval = subscription.items.data[0]?.price?.recurring?.interval
    const creditsResetAt = interval === 'year'
      ? new Date(renewalNow + 365 * 24 * 60 * 60 * 1000)
      : new Date(renewalNow + 30 * 24 * 60 * 60 * 1000)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          creditsRemaining: TIER_CREDITS[tier],
          creditsResetAt,
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: TIER_CREDITS[tier],
          type: 'subscription_renewal',
          description: `${tier} credits - Subscription renewal`,
        },
      }),
    ])
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: subscription.status,
      subscriptionEndDate: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: 'FREE',
      subscriptionStatus: 'canceled',
      stripeSubscriptionId: null,
      subscriptionEndDate: new Date(),
      creditsRemaining: TIER_CREDITS.FREE,
      creditsResetAt: null,
    },
  })
}

