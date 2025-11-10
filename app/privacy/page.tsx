import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Combien sur 10',
  description: 'Politique de confidentialité et protection des données personnelles',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Politique de confidentialité
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p>
                Chez Combien sur 10, nous respectons votre vie privée et nous engageons à protéger
                vos données personnelles. Cette politique de confidentialité explique comment nous
                collectons, utilisons et protégeons vos informations conformément au Règlement
                Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Données collectées
              </h2>
              <p>Nous collectons les données suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Informations de compte :</strong> email, nom (si fourni), mot de passe
                  (crypté)
                </li>
                <li>
                  <strong>Résultats d'analyse :</strong> scores d'attractivité, métadonnées
                  d'analyse (PAS les photos)
                </li>
                <li>
                  <strong>Données d'utilisation :</strong> historique des analyses, crédits
                  utilisés, parrainages
                </li>
                <li>
                  <strong>Données techniques :</strong> adresse IP, type de navigateur, cookies
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Traitement des photos
              </h2>
              <p className="font-semibold text-purple-600">
                IMPORTANT : Vos photos ne sont JAMAIS stockées sur nos serveurs.
              </p>
              <p>
                L'analyse faciale se fait directement dans votre navigateur. Une fois l'analyse
                terminée, la photo est supprimée. Seuls les résultats d'analyse (score, breakdown)
                sont conservés en base de données.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Utilisation des données
              </h2>
              <p>Nous utilisons vos données pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir et améliorer nos services</li>
                <li>Gérer votre compte et vos crédits</li>
                <li>Traiter les parrainages et récompenses</li>
                <li>Communiquer avec vous (si nécessaire)</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Partage des données
              </h2>
              <p>
                Nous ne vendons ni ne partageons vos données personnelles avec des tiers, sauf :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Avec votre consentement explicite</li>
                <li>Pour respecter nos obligations légales</li>
                <li>Pour protéger nos droits et notre sécurité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies
              </h2>
              <p>
                Nous utilisons des cookies pour améliorer votre expérience :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cookies de session (authentification)</li>
                <li>Cookies de suivi anonyme (limites d'utilisation)</li>
                <li>Cookies de préférence (paramètres utilisateur)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Vos droits (RGPD)
              </h2>
              <p>Conformément au RGPD, vous avez le droit de :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos données</li>
                <li>Supprimer vos données (droit à l'oubli)</li>
                <li>Exporter vos données (portabilité)</li>
                <li>Vous opposer au traitement de vos données</li>
                <li>Retirer votre consentement à tout moment</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à{' '}
                <a
                  href="mailto:contact@combiensur10.fr"
                  className="text-purple-600 hover:underline"
                >
                  contact@combiensur10.fr
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Sécurité
              </h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos
                données contre tout accès non autorisé, modification, divulgation ou destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Conservation des données
              </h2>
              <p>
                Nous conservons vos données tant que votre compte est actif. Si vous supprimez
                votre compte, toutes vos données personnelles seront effacées dans un délai de
                30 jours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contact
              </h2>
              <p>
                Pour toute question concernant cette politique de confidentialité, contactez-nous
                à{' '}
                <a
                  href="mailto:contact@combiensur10.fr"
                  className="text-purple-600 hover:underline"
                >
                  contact@combiensur10.fr
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

