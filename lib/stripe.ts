import 'server-only'
import Stripe from 'stripe'
import { TIER_CREDITS } from './subscription-config'

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// For backwards compatibility - use getStripe() for new code
export const stripe = {
  get checkout() { return getStripe().checkout },
  get customers() { return getStripe().customers },
  get subscriptions() { return getStripe().subscriptions },
  get billingPortal() { return getStripe().billingPortal },
  get webhooks() { return getStripe().webhooks },
  get invoices() { return getStripe().invoices },
}

// Price IDs mapping
export const STRIPE_PRICE_IDS = {
  PRO: {
    monthly: process.env.STRIPE_PRO_PRICE_ID || '',
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || '',
  },
  PREMIUM: {
    monthly: process.env.STRIPE_PREMIUM_PRICE_ID || '',
    annual: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || '',
  },
}

// Re-export for convenience in server code
export { TIER_CREDITS } from './subscription-config'
export type { SubscriptionTier } from './subscription-config'

export interface CreateCheckoutSessionParams {
  userId: string
  userEmail: string
  tier: 'PRO' | 'PREMIUM'
  billingPeriod: 'monthly' | 'annual'
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession({
  userId,
  userEmail,
  tier,
  billingPeriod,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams) {
  const priceId = STRIPE_PRICE_IDS[tier][billingPeriod]
  
  if (!priceId) {
    throw new Error(`Invalid tier or billing period: ${tier} - ${billingPeriod}`)
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId,
      tier,
      billingPeriod,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  })

  return session
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

