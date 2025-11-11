'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BorderBeam } from '@/components/magicui/border-beam'
import { generateReferralUrl } from '@/lib/referrals'
import { Copy, Share2, Twitter, Facebook, ArrowRight } from 'lucide-react'

interface Rating {
  id: string
  score: number
  gender: string
  breakdown: {
    symmetry: number
    proportions: number
    features: number
    overall: number
  }
  createdAt: Date
  user?: {
    referralCode?: string
    name?: string | null
  } | null
}

interface ResultClientProps {
  rating: Rating
}

export default function ResultClient({ rating }: ResultClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)
  const [copiedReferral, setCopiedReferral] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const referralUrl = rating.user?.referralCode
    ? generateReferralUrl(rating.user.referralCode)
    : ''

  const copyToClipboard = (text: string, setCopiedState: (value: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setCopiedState(true)
    setTimeout(() => setCopiedState(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'from-green-400 to-green-600'
    if (score >= 6) return 'from-blue-400 to-blue-600'
    if (score >= 4) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 9) return 'Exceptionnel !'
    if (score >= 8) return 'Excellent !'
    if (score >= 7) return 'Très bien !'
    if (score >= 6) return 'Bien !'
    if (score >= 5) return 'Moyen'
    return 'Peut mieux faire'
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-4xl">
        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-8 mb-8 overflow-hidden"
        >
          <BorderBeam
            duration={8}
            size={500}
            className="from-transparent via-purple-500 to-transparent"
          />
          
          <div className="relative z-10 text-center">
            <h1 className="text-2xl font-light text-gray-300 mb-4">
              Votre Note d'Attractivité
            </h1>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`inline-block text-9xl font-bold bg-gradient-to-r ${getScoreColor(rating.score)} bg-clip-text text-transparent mb-4`}
            >
              {rating.score.toFixed(1)}
              <span className="text-5xl text-white/50">/10</span>
            </motion.div>
            
            <p className="text-xl text-white font-light">{getScoreMessage(rating.score)}</p>
            <p className="text-sm text-gray-400 mt-2">
              Genre: {rating.gender === 'homme' ? '👨 Homme' : '👩 Femme'}
            </p>
          </div>
        </motion.div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-xl p-6"
          >
            <h3 className="text-lg font-light text-gray-300 mb-2">Symétrie</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#8096D2]">
                {rating.breakdown.symmetry}
              </span>
              <span className="text-xl text-gray-400 mb-1">/100</span>
            </div>
            <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rating.breakdown.symmetry}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#5B698B] to-[#8096D2]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-xl p-6"
          >
            <h3 className="text-lg font-light text-gray-300 mb-2">Nombre d'Or</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#8096D2]">
                {rating.breakdown.proportions}
              </span>
              <span className="text-xl text-gray-400 mb-1">/100</span>
            </div>
            <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rating.breakdown.proportions}%` }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#5B698B] to-[#8096D2]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-xl p-6"
          >
            <h3 className="text-lg font-light text-gray-300 mb-2">Qualité des Traits</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#8096D2]">
                {rating.breakdown.features}
              </span>
              <span className="text-xl text-gray-400 mb-1">/100</span>
            </div>
            <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rating.breakdown.features}%` }}
                transition={{ delay: 0.7, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#5B698B] to-[#8096D2]"
              />
            </div>
          </motion.div>
        </div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border border-[#5B698B] rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-light text-gray-300 mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Partager vos résultats
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => copyToClipboard(shareUrl, setCopied)}
              className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-[#5B698B] rounded-lg text-white hover:bg-black/50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copié !' : 'Copier le lien'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=J'ai obtenu ${rating.score}/10 sur combiensur10.fr !&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-700/20 border border-blue-600/50 rounded-lg text-blue-300 hover:bg-blue-700/30 transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          </div>
        </motion.div>

        {/* Referral Section (if authenticated) */}
        {session && referralUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-light text-green-300 mb-2">
              🎁 Parrainez vos amis et gagnez des crédits !
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Invitez vos amis à essayer combiensur10.fr et recevez 10 crédits gratuits pour chaque inscription !
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-black/30 border border-green-500/30 rounded-lg text-white text-sm"
              />
              <button
                onClick={() => copyToClipboard(referralUrl, setCopiedReferral)}
                className="px-4 py-2 bg-green-600/30 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/40 transition-colors"
              >
                {copiedReferral ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Votre code de parrainage: <span className="font-mono text-green-400">{rating.user?.referralCode}</span>
            </p>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-xl font-light hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Analyser un autre visage
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {!session && (
            <button
              onClick={() => router.push('/auth/signup')}
              className="flex-1 px-6 py-3 border-2 border-[#5B698B] text-white rounded-xl font-light hover:bg-[#5B698B]/10 transition-colors"
            >
              Créer un compte
            </button>
          )}
          
          {session && (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-6 py-3 border-2 border-[#5B698B] text-white rounded-xl font-light hover:bg-[#5B698B]/10 transition-colors"
            >
              Tableau de bord
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
