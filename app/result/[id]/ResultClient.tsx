'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RatingDisplay } from '@/components/RatingDisplay'
import { ShareButtons } from '@/components/ShareButtons'
import { CreditBadge } from '@/components/CreditBadge'
import { FaceAnalysis } from '@/lib/face-rating'

interface ResultClientProps {
  rating: {
    id: string
    score: number
    breakdown: any
    gender: string
    createdAt: Date
  }
  session: any
}

export function ResultClient({ rating, session }: ResultClientProps) {
  const router = useRouter()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resultUrl = `${appUrl}/result/${rating.id}`

  const breakdown: FaceAnalysis = {
    symmetry: rating.breakdown.symmetry || 0,
    proportions: rating.breakdown.proportions || 0,
    features: rating.breakdown.features || 0,
    overall: rating.breakdown.overall || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Votre résultat
          </h1>
          <p className="text-gray-600">
            Analyse basée sur la symétrie, les proportions et les traits faciaux
          </p>
        </motion.div>

        {/* Credits Badge */}
        {session?.user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-6"
          >
            <CreditBadge credits={session.user.creditsRemaining || 0} />
          </motion.div>
        )}

        {/* Rating Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <RatingDisplay score={rating.score} breakdown={breakdown} />
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <ShareButtons score={rating.score} url={resultUrl} />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4"
        >
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            ✨ Essayer à nouveau
          </button>

          {!session && (
            <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vous avez épuisé votre essai gratuit 🎁
              </h3>
              <p className="text-gray-600 mb-4">
                Créez un compte pour obtenir <strong>5 crédits gratuits</strong> et
                gagnez-en plus en parrainant vos amis !
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  S'inscrire gratuitement
                </button>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Se connecter
                </button>
              </div>
            </div>
          )}

          {session && (
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gagnez plus de crédits ! 🎁
              </h3>
              <p className="text-gray-600 mb-4">
                Partagez votre lien de parrainage et gagnez{' '}
                <strong>10 crédits par ami inscrit</strong>
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Voir mon tableau de bord
              </button>
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>
            💡 L'attractivité est subjective. Ce score est basé sur des critères
            techniques et ne définit pas votre valeur personnelle.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

