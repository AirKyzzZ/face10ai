'use client'

import { motion } from 'framer-motion'

interface ShareButtonsProps {
  score: number
  url: string
}

export function ShareButtons({ score, url }: ShareButtonsProps) {
  const shareText = `J'ai obtenu ${score}/10 sur Combien sur 10 ! Découvre ta note d'attractivité :`

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`
    window.open(facebookUrl, '_blank')
  }

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText + ' ' + url
    )}`
    window.open(whatsappUrl, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    alert('Lien copié dans le presse-papier !')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 text-center">
        Partager mon résultat
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        <ShareButton
          label="Twitter"
          icon="🐦"
          onClick={shareOnTwitter}
          className="bg-blue-400 hover:bg-blue-500"
        />
        <ShareButton
          label="Facebook"
          icon="📘"
          onClick={shareOnFacebook}
          className="bg-blue-600 hover:bg-blue-700"
        />
        <ShareButton
          label="WhatsApp"
          icon="💬"
          onClick={shareOnWhatsApp}
          className="bg-green-500 hover:bg-green-600"
        />
        <ShareButton
          label="Copier le lien"
          icon="🔗"
          onClick={copyLink}
          className="bg-gray-600 hover:bg-gray-700"
        />
      </div>
    </div>
  )
}

interface ShareButtonProps {
  label: string
  icon: string
  onClick: () => void
  className: string
}

function ShareButton({ label, icon, onClick, className }: ShareButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-white font-medium text-sm flex items-center gap-2 ${className}`}
    >
      <span>{icon}</span>
      {label}
    </motion.button>
  )
}

