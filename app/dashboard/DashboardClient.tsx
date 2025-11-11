'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Copy, Coins, TrendingUp, Users, Calendar, ArrowLeft, RefreshCw } from 'lucide-react'
import { generateReferralUrl } from '@/lib/referrals'
import { BorderBeam } from '@/components/magicui/border-beam'

interface User {
  id: string
  name: string | null
  email: string
  creditsRemaining: number
  referralCode: string
  createdAt: Date
  ratings: Array<{
    id: string
    score: number
    gender: string
    createdAt: Date
  }>
}

interface ReferralStats {
  totalReferrals: number
  totalCreditsEarned: number
  referrals: Array<{
    id: string
    creditsAwarded: number
    createdAt: Date
    referredUser: {
      name: string | null
      email: string
      createdAt: Date
    }
  }>
}

interface DashboardClientProps {
  user: User
  referralStats: ReferralStats
}

export default function DashboardClient({ user, referralStats }: DashboardClientProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const referralUrl = generateReferralUrl(user.referralCode)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const syncSubscription = async () => {
    setIsSyncing(true)
    setSyncMessage(null)
    
    try {
      const response = await fetch('/api/stripe/sync-subscription', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSyncMessage(`✅ ${data.message}`)
        // Refresh the page after 1 second to show updated data
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        setSyncMessage(`❌ ${data.error || 'Erreur de synchronisation'}`)
      }
    } catch (error) {
      setSyncMessage('❌ Erreur de connexion')
    } finally {
      setIsSyncing(false)
      setTimeout(() => setSyncMessage(null), 5000)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-blue-400'
    if (score >= 4) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Back to Homepage Button & Sync */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-4 flex-wrap"
        >
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-lg text-white hover:border-[#8096D2] transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-light">Retour à l'accueil</span>
          </motion.button>

          {/* Sync Subscription Button */}
          <motion.button
            onClick={syncSubscription}
            disabled={isSyncing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] border-2 border-[#5B698B] rounded-lg text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="font-light">
              {isSyncing ? 'Synchronisation...' : 'Sync Abonnement'}
            </span>
          </motion.button>

          {/* Sync Message */}
          {syncMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-2 bg-[#2E3139] border border-[#5B698B] rounded-lg text-sm"
            >
              {syncMessage}
            </motion.div>
          )}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-light text-white mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-400 font-light">
            Bienvenue {user.name || 'sur votre tableau de bord'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-6 overflow-hidden"
          >
            <BorderBeam duration={8} size={300} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#5B698B]/20 rounded-lg">
                  <Coins className="w-6 h-6 text-[#8096D2]" />
                </div>
                <h3 className="text-lg font-light text-gray-300">Crédits</h3>
              </div>
              <p className="text-4xl font-bold text-white">{user.creditsRemaining}</p>
              <p className="text-sm text-gray-400 mt-1">crédits disponibles</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#5B698B]/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#8096D2]" />
              </div>
              <h3 className="text-lg font-light text-gray-300">Analyses</h3>
            </div>
            <p className="text-4xl font-bold text-white">{user.ratings.length}</p>
            <p className="text-sm text-gray-400 mt-1">analyses effectuées</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#5B698B]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#8096D2]" />
              </div>
              <h3 className="text-lg font-light text-gray-300">Parrainages</h3>
            </div>
            <p className="text-4xl font-bold text-white">{referralStats.totalReferrals}</p>
            <p className="text-sm text-gray-400 mt-1">
              {referralStats.totalCreditsEarned} crédits gagnés
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Past Analyses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-2xl p-6"
          >
            <h2 className="text-2xl font-light text-white mb-6">
              Vos Analyses
            </h2>

            {user.ratings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Aucune analyse pour le moment</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-lg font-light hover:opacity-90 transition-opacity"
                >
                  Commencer une analyse
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {user.ratings.map((rating) => (
                  <motion.div
                    key={rating.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => router.push(`/result/${rating.id}`)}
                    className="p-4 bg-black/30 border border-[#5B698B]/50 rounded-lg cursor-pointer hover:border-[#8096D2] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {rating.gender === 'homme' ? '👨' : '👩'}
                        </span>
                        <div>
                          <p className={`text-2xl font-bold ${getScoreColor(rating.score)}`}>
                            {rating.score.toFixed(1)}/10
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Referral Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-light text-green-300 mb-2">
              🎁 Programme de Parrainage
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              Invitez vos amis et recevez 10 crédits pour chaque inscription !
            </p>

            {/* Referral Link */}
            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2 font-light">
                Votre lien de parrainage
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-black/30 border border-green-500/30 rounded-lg text-white text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600/30 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/40 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copié!' : 'Copier'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Code: <span className="font-mono text-green-400">{user.referralCode}</span>
              </p>
            </div>

            {/* Referral Stats */}
            <div className="mb-6 p-4 bg-black/30 border border-green-500/20 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-400">
                    {referralStats.totalReferrals}
                  </p>
                  <p className="text-xs text-gray-400">Parrainages</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">
                    {referralStats.totalCreditsEarned}
                  </p>
                  <p className="text-xs text-gray-400">Crédits gagnés</p>
                </div>
              </div>
            </div>

            {/* Referral List */}
            {referralStats.referrals.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-300 mb-3 font-light">
                  Vos parrainages récents
                </h3>
                <div className="space-y-2">
                  {referralStats.referrals.slice(0, 5).map((referral) => (
                    <div
                      key={referral.id}
                      className="p-3 bg-black/30 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white font-light">
                            {referral.referredUser.name || referral.referredUser.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(referral.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-green-400 text-sm font-bold">
                          +{referral.creditsAwarded}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-xl font-light text-lg hover:opacity-90 transition-opacity"
          >
            Nouvelle Analyse
          </button>
        </motion.div>
      </div>
    </div>
  )
}
