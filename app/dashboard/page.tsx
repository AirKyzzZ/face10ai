import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { getReferralStats, generateReferralUrl } from '@/lib/referrals'
import { DashboardClient } from './DashboardClient'

export const metadata = {
  title: 'Tableau de bord - Combien sur 10',
  description: 'Gérez vos crédits, consultez votre historique et partagez votre lien de parrainage',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      ratings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      creditTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  const referralStats = await getReferralStats(session.user.id)
  const referralUrl = generateReferralUrl(user.referralCode)

  return (
    <DashboardClient
      user={{
        name: user.name || 'Utilisateur',
        email: user.email,
        creditsRemaining: user.creditsRemaining,
        totalUploads: user.totalUploads,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      }}
      ratings={user.ratings}
      creditTransactions={user.creditTransactions}
      referralStats={referralStats}
      referralUrl={referralUrl}
    />
  )
}

