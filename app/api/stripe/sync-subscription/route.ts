import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        creditsRemaining: true,
        creditsResetAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // If no Stripe customer ID, search by email
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      })

      if (customers.data.length > 0) {
        customerId = customers.data[0].id
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        })
      }
    }

    if (!customerId) {
      return NextResponse.json({
        message: 'Aucun compte Stripe trouvé',
        tier: 'FREE',
        credits: user.creditsRemaining,
      })
    }

    // Get all subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        message: 'Aucun abonnement actif',
        tier: 'FREE',
      })
    }

    const subscription = subscriptions.data[0]
    
    // Determine tier from price
    const priceId = subscription.items.data[0].price.id
    let tier: 'PRO' | 'PREMIUM' = 'PRO'
    
    if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
      tier = 'PREMIUM'
    } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      tier = 'PRO'
    } else {
      // Unknown price, default to PRO
      tier = 'PRO'
    }

    // Only set creditsResetAt if it doesn't exist (first time setup)
    const shouldSetResetDate = !user.creditsResetAt
    const creditsResetAt = shouldSetResetDate ? (() => {
      const date = new Date()
      date.setMonth(date.getMonth() + 1)
      return date
    })() : undefined

    // Update user subscription metadata ONLY (preserve credits)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: subscription.status,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        subscriptionStartDate: new Date(subscription.created * 1000),
        ...(creditsResetAt && { creditsResetAt }),
      },
    })

    return NextResponse.json({
      message: 'Abonnement synchronisé avec succès!',
      tier,
      credits: user.creditsRemaining,
      status: subscription.status,
    })

  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la synchronisation' },
      { status: 500 }
    )
  }
}

