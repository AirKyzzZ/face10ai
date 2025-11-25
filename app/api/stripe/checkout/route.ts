import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { tier, billingPeriod = 'annual' } = await req.json()
    
    if (!tier || !['PRO', 'PREMIUM'].includes(tier)) {
      return NextResponse.json(
        { error: 'Niveau d\'abonnement invalide' },
        { status: 400 }
      )
    }

    if (!billingPeriod || !['monthly', 'annual'].includes(billingPeriod)) {
      return NextResponse.json(
        { error: 'Période de facturation invalide' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/dashboard?subscription=success`
    const cancelUrl = `${baseUrl}/pricing?subscription=canceled`

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email,
      tier,
      billingPeriod,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    )
  }
}

