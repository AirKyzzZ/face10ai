'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { CreditBadge } from './CreditBadge'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Combien sur 10
          </Link>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <CreditBadge credits={session.user.creditsRemaining || 0} />
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

