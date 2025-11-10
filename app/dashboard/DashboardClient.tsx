'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ReferralSection } from '@/components/ReferralSection'

interface DashboardClientProps {
  user: {
    name: string
    email: string
    creditsRemaining: number
    totalUploads: number
    referralCode: string
    createdAt: Date
  }
  ratings: Array<{
    id: string
    score: number
    gender: string
    createdAt: Date
  }>
  creditTransactions: Array<{
    id: string
    amount: number
    type: string
    description: string
    createdAt: Date
  }>
  referralStats: {
    totalReferrals: number
    totalCreditsEarned: number
    referrals: any[]
  }
  referralUrl: string
}

export function DashboardClient({
  user,
  ratings,
  creditTransactions,
  referralStats,
  referralUrl,
}: DashboardClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue, {user.name} !
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon="💳"
            label="Crédits disponibles"
            value={user.creditsRemaining}
            color="purple"
          />
          <StatsCard
            icon="📸"
            label="Analyses effectuées"
            value={user.totalUploads}
            color="blue"
          />
          <StatsCard
            icon="👥"
            label="Parrainages"
            value={referralStats.totalReferrals}
            color="green"
          />
        </div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ReferralSection
            referralCode={user.referralCode}
            referralUrl={referralUrl}
            stats={{
              totalReferrals: referralStats.totalReferrals,
              totalCreditsEarned: referralStats.totalCreditsEarned,
            }}
          />
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Historique des analyses
              </h2>
              {ratings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">Aucune analyse pour le moment</p>
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Faire ma première analyse
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <div
                      key={rating.id}
                      onClick={() => router.push(`/result/${rating.id}`)}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          Score: {rating.score}/10
                        </div>
                        <div className="text-sm text-gray-600">
                          {rating.gender === 'homme' ? '👨' : '👩'} {' '}
                          {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Credit History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Historique des crédits
              </h2>
              {creditTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune transaction pour le moment
                </div>
              ) : (
                <div className="space-y-3">
                  {creditTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <div
                        className={`font-bold text-lg ${
                          transaction.amount > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            ✨ Nouvelle analyse
          </button>
        </motion.div>
      </div>
    </div>
  )
}

interface StatsCardProps {
  icon: string
  label: string
  value: number
  color: 'purple' | 'blue' | 'green'
}

function StatsCard({ icon, label, value, color }: StatsCardProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </motion.div>
  )
}

