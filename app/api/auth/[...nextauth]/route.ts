import NextAuth, { AuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Only include Google provider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error('Email ou mot de passe incorrect')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Email ou mot de passe incorrect')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id
      }
      
      // Award initial credits on first sign-in
      if (account && trigger === 'signUp') {
        const initialCredits = parseInt(process.env.INITIAL_SIGNUP_CREDITS || '5')
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            creditsRemaining: initialCredits,
            authProvider: account.provider,
          },
        })
        
        await prisma.creditTransaction.create({
          data: {
            userId: user.id,
            amount: initialCredits,
            type: 'initial',
            description: 'Crédits initiaux pour nouveau compte',
          },
        })
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        
        // Fetch latest user data including credits
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            creditsRemaining: true,
            referralCode: true,
          },
        })
        
        if (user) {
          session.user.creditsRemaining = user.creditsRemaining
          session.user.referralCode = user.referralCode
        }
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
