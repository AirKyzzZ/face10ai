import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-purple-600 mb-4">
              face10ai
            </h3>
            <p className="text-gray-600 text-sm">
              Découvrez votre note d'attractivité grâce à notre algorithme IA avancé.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-purple-600">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-600">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-purple-600">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-purple-600">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-purple-600">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <p className="text-gray-600 text-sm">
              Besoin d'aide ?<br />
              <a href="mailto:contact@face10ai.com" className="text-purple-600 hover:underline">
                contact@face10ai.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} face10ai. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

