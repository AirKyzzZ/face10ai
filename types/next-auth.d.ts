import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      creditsRemaining?: number
      referralCode?: string
      subscriptionTier?: string
      subscriptionStatus?: string | null
      stripeCustomerId?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    creditsRemaining?: number
    referralCode?: string
    subscriptionTier?: string
    subscriptionStatus?: string | null
    stripeCustomerId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    creditsRemaining?: number
    referralCode?: string
    subscriptionTier?: string
    subscriptionStatus?: string | null
    stripeCustomerId?: string | null
  }
}
