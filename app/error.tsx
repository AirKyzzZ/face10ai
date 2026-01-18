'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-500 mb-4">Oops!</div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Une erreur s&apos;est produite
          </h1>
          <p className="text-gray-400">
            Nous sommes désolés pour ce désagrément. Veuillez réessayer.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Réessayer
          </button>

          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-gray-500">
            Code d&apos;erreur: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
