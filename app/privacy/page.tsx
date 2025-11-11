import Link from 'next/link'
import Header from '@/components/Header'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-light text-white mb-6">
            Politique de Confidentialité
          </h1>

          <div className="space-y-6 text-gray-300 font-light leading-relaxed">
            <p className="text-sm text-gray-400">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              1. Collecte des Données
            </h2>
            <p>
              combiensur10.fr collecte uniquement les données nécessaires au fonctionnement du service :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email et mot de passe (pour les comptes utilisateurs)</li>
              <li>Résultats d'analyse (scores et statistiques uniquement)</li>
              <li>Données de parrainage (codes et relations)</li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              2. Traitement des Images
            </h2>
            <p>
              <strong className="text-white">Important :</strong> Vos photos ne sont jamais stockées sur nos serveurs. L'analyse faciale se fait entièrement dans votre navigateur grâce à la technologie face-api.js. Seul un hash cryptographique de l'image (pour éviter les duplications) et les résultats d'analyse sont sauvegardés.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              3. Utilisation des Données
            </h2>
            <p>
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fournir le service d'analyse faciale</li>
              <li>Gérer votre compte utilisateur</li>
              <li>Gérer le système de crédits et de parrainage</li>
              <li>Améliorer notre service</li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              4. Partage des Données
            </h2>
            <p>
              Nous ne vendons, n'échangeons et ne transférons pas vos données personnelles à des tiers. Vos informations restent strictement confidentielles.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              5. Cookies et Suivi
            </h2>
            <p>
              Nous utilisons des cookies essentiels pour :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintenir votre session connectée</li>
              <li>Suivre les analyses anonymes (pour la limite gratuite)</li>
              <li>Enregistrer vos préférences</li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              6. Sécurité
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              7. Vos Droits
            </h2>
            <p>
              Conformément au RGPD, vous avez le droit de :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données</li>
              <li>Supprimer votre compte et vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Porter vos données</li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              8. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, contactez-nous à{' '}
              <a 
                href="mailto:contact@combiensur10.fr" 
                className="text-[#8096D2] hover:underline"
              >
                contact@combiensur10.fr
              </a>
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-xl font-light hover:opacity-90 transition-opacity"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
