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
        stripeSubscriptionId: true,
        subscriptionTier: true,
      },
    })

    if (!user || !user.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'Aucun abonnement actif trouvé' },
        { status: 404 }
      )
    }

    // Cancel subscription at period end (user keeps access until then)
    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    )

    // Get the period end timestamp (type assertion needed for Stripe SDK types)
    const periodEnd = (subscription as any).current_period_end as number

    // Update user subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionEndDate: new Date(periodEnd * 1000),
      },
    })

    return NextResponse.json({
      message: 'Abonnement annulé avec succès',
      endsAt: new Date(periodEnd * 1000),
    })

  } catch (error: any) {
    console.error('Cancel error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'annulation' },
      { status: 500 }
    )
  }
}

