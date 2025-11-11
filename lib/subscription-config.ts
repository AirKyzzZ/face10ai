// Subscription tier configuration
// This file can be safely imported in both client and server code

export type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM'

// Subscription tier credits mapping
export const TIER_CREDITS = {
  FREE: 5,
  PRO: 25,
  PREMIUM: 50,
} as const

// Subscription tier pricing
export const TIER_PRICING = {
  FREE: 0,
  PRO: 6.99,
  PREMIUM: 13.99,
} as const

// Original prices (before discount)
export const TIER_ORIGINAL_PRICING = {
  FREE: 0,
  PRO: 9.99,
  PREMIUM: 19.99,
} as const

