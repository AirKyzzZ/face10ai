'use client'

import { motion } from 'framer-motion'
import { FaceAnalysis } from '@/lib/face-rating'

interface RatingDisplayProps {
  score: number
  breakdown: FaceAnalysis
}

export function RatingDisplay({ score, breakdown: _breakdown }: RatingDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-blue-600'
    if (score >= 4) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 9) return 'Exceptionnel ! 🌟'
    if (score >= 8) return 'Excellent ! ✨'
    if (score >= 7) return 'Très bien ! 👍'
    if (score >= 6) return 'Bien ! 😊'
    if (score >= 5) return 'Correct ! 👌'
    return 'Intéressant ! 💭'
  }

  return (
    <div className="space-y-8">
      {/* Main Score */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="text-center"
      >
        <div className={`text-8xl font-bold ${getScoreColor(score)}`}>
          {score}
          <span className="text-4xl text-gray-400">/10</span>
        </div>
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          {getScoreMessage(score)}
        </p>
        <div className="mt-6 pt-6">
          <p className="text-sm text-gray-600 text-center">
            Analyse réalisée par notre algorithme IA avancé basé sur des milliers de caractéristiques faciales
          </p>
        </div>
      </motion.div>
    </div>
  )
}

