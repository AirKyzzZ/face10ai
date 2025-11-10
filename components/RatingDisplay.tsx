'use client'

import { motion } from 'framer-motion'
import { FaceAnalysis } from '@/lib/face-rating'

interface RatingDisplayProps {
  score: number
  breakdown: FaceAnalysis
}

export function RatingDisplay({ score, breakdown }: RatingDisplayProps) {
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
      </motion.div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Analyse détaillée
        </h3>

        <div className="space-y-4">
          <BreakdownItem
            label="Symétrie faciale"
            value={breakdown.symmetry}
            icon="⚖️"
          />
          <BreakdownItem
            label="Proportions"
            value={breakdown.proportions}
            icon="📐"
          />
          <BreakdownItem
            label="Traits du visage"
            value={breakdown.features}
            icon="✨"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Analyse réalisée par notre algorithme IA avancé basé sur des milliers de caractéristiques faciales
          </p>
        </div>
      </div>
    </div>
  )
}

interface BreakdownItemProps {
  label: string
  value: number
  icon: string
}

function BreakdownItem({ label, value, icon }: BreakdownItemProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {icon} {label}
        </span>
        <span className="text-sm font-semibold text-purple-600">
          {value}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
        />
      </div>
    </div>
  )
}

