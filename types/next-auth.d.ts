import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    creditsRemaining?: number
    referralCode?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      creditsRemaining?: number
      referralCode?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

