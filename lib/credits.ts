import { prisma } from './prisma'
import { TIER_CREDITS } from './stripe'

export async function checkCredits(userId: string): Promise<number> {
  // Check if credits need to be refreshed
  await refreshMonthlyCredits(userId)
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true },
  })
  
  return user?.creditsRemaining || 0
}

export async function refreshMonthlyCredits(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      subscriptionStatus: true,
      creditsResetAt: true,
      creditsRemaining: true,
    },
  })

  if (!user) return

  // Only refresh for active paid subscriptions
  if (
    user.subscriptionTier !== 'FREE' &&
    user.subscriptionStatus === 'active' &&
    user.creditsResetAt &&
    new Date() >= user.creditsResetAt
  ) {
    const tier = user.subscriptionTier as 'PRO' | 'PREMIUM'
    const newCredits = TIER_CREDITS[tier]
    
    // Set next reset date (1 month from now)
    const nextResetAt = new Date()
    nextResetAt.setMonth(nextResetAt.getMonth() + 1)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          creditsRemaining: newCredits,
          creditsResetAt: nextResetAt,
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: newCredits,
          type: 'monthly_refresh',
          description: `Crédits ${tier} - Renouvellement mensuel automatique`,
        },
      }),
    ])
  }
}

export async function deductCredit(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditsRemaining: true },
    })

    if (!user || user.creditsRemaining <= 0) {
      return false
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          creditsRemaining: { decrement: 1 },
          totalUploads: { increment: 1 },
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: -1,
          type: 'usage',
          description: 'Analyse de visage',
        },
      }),
    ])

    return true
  } catch (error) {
    console.error('Error deducting credit:', error)
    return false
  }
}

export async function addCredits(
  userId: string,
  amount: number,
  type: string,
  description: string
): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        creditsRemaining: { increment: amount },
      },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
      },
    }),
  ])
}

export async function getCreditHistory(userId: string, limit = 10) {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}
