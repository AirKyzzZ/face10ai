import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { getReferralStats } from '@/lib/referrals'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      ratings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  const referralStats = await getReferralStats(session.user.id)

  return (
    <DashboardClient
      user={user}
      referralStats={referralStats}
    />
  )
}
