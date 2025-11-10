'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Erreur de configuration du serveur'
      case 'AccessDenied':
        return 'Accès refusé'
      case 'Verification':
        return 'Le lien de vérification a expiré ou a déjà été utilisé'
      default:
        return 'Une erreur est survenue lors de l\'authentification'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Erreur d'authentification
        </h1>
        <p className="text-gray-600 mb-8">
          {getErrorMessage(error)}
        </p>
        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Réessayer
          </Link>
          <Link
            href="/"
            className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

