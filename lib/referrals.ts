import { prisma } from './prisma'
import { addCredits } from './credits'

export async function trackReferral(
  referralCode: string,
  newUserId: string
): Promise<void> {
  try {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    })

    if (!referrer || referrer.id === newUserId) {
      return
    }

    const creditsAmount = parseInt(
      process.env.REFERRAL_CREDITS_AMOUNT || '10'
    )

    // Check if referral already exists
    const existingReferral = await prisma.referral.findFirst({
      where: {
        referredUserId: newUserId,
      },
    })

    if (existingReferral) {
      return
    }

    // Create referral record and award credits
    await prisma.$transaction([
      prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredUserId: newUserId,
          creditsAwarded: creditsAmount,
        },
      }),
      prisma.user.update({
        where: { id: newUserId },
        data: { referredBy: referrer.id },
      }),
    ])

    await addCredits(
      referrer.id,
      creditsAmount,
      'referral',
      `Parrainage de nouveau utilisateur`
    )
  } catch (error) {
    console.error('Error tracking referral:', error)
  }
}

export async function getReferralStats(userId: string) {
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    include: {
      referredUser: {
        select: {
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalCreditsEarned = referrals.reduce(
    (sum, ref) => sum + ref.creditsAwarded,
    0
  )

  return {
    totalReferrals: referrals.length,
    totalCreditsEarned,
    referrals,
  }
}

export function generateReferralUrl(referralCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}?ref=${referralCode}`
}
