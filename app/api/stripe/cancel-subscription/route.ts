import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel subscription at period end (user keeps access until then)
    const subscription = await getStripe().subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    )

    // cancel_at is set by Stripe when cancel_at_period_end is true
    const endsAt = subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000)
      : new Date()

    // Update user subscription status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionEndDate: endsAt,
      },
    })

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      endsAt,
    })

  } catch (error) {
    console.error('Cancel error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

