'use client'

import { motion } from 'framer-motion'

interface GenderSelectorProps {
  selectedGender: 'homme' | 'femme' | null
  onSelect: (gender: 'homme' | 'femme') => void
}

export function GenderSelector({ selectedGender, onSelect }: GenderSelectorProps) {
  return (
    <div className="flex gap-4 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('homme')}
        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedGender === 'homme'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
        }`}
      >
        👨 Homme
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect('femme')}
        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
          selectedGender === 'femme'
            ? 'bg-pink-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-600'
        }`}
      >
        👩 Femme
      </motion.button>
    </div>
  )
}

