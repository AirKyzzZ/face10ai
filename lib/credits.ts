import { prisma } from './prisma'

export async function checkCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true },
  })
  
  return user?.creditsRemaining || 0
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
