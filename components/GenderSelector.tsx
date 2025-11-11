'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface GenderSelectorProps {
  selectedGender: 'homme' | 'femme' | null
  onSelect: (gender: 'homme' | 'femme') => void
}

export function GenderSelector({ selectedGender, onSelect }: GenderSelectorProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveredHomme, setIsHoveredHomme] = useState(false);
  const [isHoveredFemme, setIsHoveredFemme] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div className="flex gap-6 justify-center">
      <motion.button
        onClick={() => onSelect('homme')}
        onMouseMove={handleMouseMove}
        onHoverStart={() => setIsHoveredHomme(true)}
        onHoverEnd={() => setIsHoveredHomme(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative overflow-hidden border-[2px] rounded-xl px-10 py-6 text-white backdrop-blur-sm transition-all ${
          selectedGender === 'homme'
            ? 'border-[#5B698B] bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040]'
            : 'border-[#5B698B] bg-gradient-to-b from-black to-[rgb(65,64,64)]'
        }`}
      >
        <span className="relative z-10 text-lg font-light">👨 Homme</span>
        {isHoveredHomme && (
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              background: [
                `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 50%)`,
              ],
            }}
            transition={{ duration: 0.15 }}
          />
        )}
      </motion.button>

      <motion.button
        onClick={() => onSelect('femme')}
        onMouseMove={handleMouseMove}
        onHoverStart={() => setIsHoveredFemme(true)}
        onHoverEnd={() => setIsHoveredFemme(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative overflow-hidden border-[2px] rounded-xl px-10 py-6 text-white backdrop-blur-sm transition-all ${
          selectedGender === 'femme'
            ? 'border-[#5B698B] bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040]'
            : 'border-[#5B698B] bg-gradient-to-b from-black to-[rgb(65,64,64)]'
        }`}
      >
        <span className="relative z-10 text-lg font-light">👩 Femme</span>
        {isHoveredFemme && (
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              background: [
                `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 50%)`,
              ],
            }}
            transition={{ duration: 0.15 }}
          />
        )}
      </motion.button>
    </div>
  )
}
