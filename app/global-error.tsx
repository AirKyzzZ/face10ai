'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body className="bg-black">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="text-6xl font-bold text-red-500 mb-4">500</div>
              <h1 className="text-2xl font-semibold text-white mb-2">
                Erreur serveur
              </h1>
              <p className="text-gray-400">
                Une erreur inattendue s&apos;est produite. Notre équipe a été notifiée.
              </p>
            </div>

            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Réessayer
            </button>

            {error.digest && (
              <p className="mt-6 text-xs text-gray-500">
                Code: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
