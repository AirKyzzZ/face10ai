'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ReferralSectionProps {
  referralCode: string
  referralUrl: string
  stats?: {
    totalReferrals: number
    totalCreditsEarned: number
  }
}

export function ReferralSection({
  referralCode,
  referralUrl,
  stats,
}: ReferralSectionProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    const text = `Découvre ta note d'attractivité sur Combien sur 10 ! Utilise mon lien de parrainage pour obtenir des crédits gratuits :`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(referralUrl)}`
    window.open(twitterUrl, '_blank')
  }

  const shareOnWhatsApp = () => {
    const text = `Découvre ta note d'attractivité sur Combien sur 10 ! Utilise mon lien de parrainage : ${referralUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Gagnez plus de crédits ! 🎁
        </h3>
        <p className="text-gray-600">
          Partagez votre lien de parrainage et gagnez{' '}
          <span className="font-semibold text-purple-600">10 crédits</span> par ami inscrit
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalReferrals}
            </div>
            <div className="text-sm text-gray-600">Parrainages</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.totalCreditsEarned}
            </div>
            <div className="text-sm text-gray-600">Crédits gagnés</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Votre lien de parrainage
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            {copied ? '✓ Copié' : 'Copier'}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareOnTwitter}
          className="px-6 py-2 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
        >
          🐦 Partager sur Twitter
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareOnWhatsApp}
          className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          💬 Partager sur WhatsApp
        </motion.button>
      </div>
    </div>
  )
}

