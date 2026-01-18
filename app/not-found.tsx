import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-700 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Page non trouvée
          </h1>
          <p className="text-gray-400">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}

