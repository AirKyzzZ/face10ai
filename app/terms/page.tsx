import Link from 'next/link'
import Header from '@/components/Header'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-light text-white mb-6">
            Conditions d'Utilisation
          </h1>

          <div className="space-y-6 text-gray-300 font-light leading-relaxed">
            <p className="text-sm text-gray-400">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              1. Acceptation des Conditions
            </h2>
            <p>
              En utilisant combiensur10.fr, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              2. Description du Service
            </h2>
            <p>
              combiensur10.fr est un service d'analyse faciale basé sur l'intelligence artificielle qui évalue l'attractivité selon des critères scientifiques. Le service est fourni à titre informatif et divertissant uniquement.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              3. Utilisation Acceptable
            </h2>
            <p>
              Vous vous engagez à :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Utiliser le service de manière légale et éthique</li>
              <li>Ne pas analyser des photos de tiers sans leur consentement</li>
              <li>Ne pas utiliser le service à des fins discriminatoires</li>
              <li>Ne pas tenter de contourner les limitations du service</li>
              <li>Ne pas créer de faux comptes ou abuser du système de parrainage</li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              4. Système de Crédits
            </h2>
            <p>
              Notre service fonctionne avec un système de crédits :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>1 analyse gratuite pour les utilisateurs non inscrits</li>
              <li>5 crédits offerts lors de l'inscription</li>
              <li>10 crédits par parrainage réussi</li>
              <li>1 crédit par analyse</li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              5. Limitation de Responsabilité
            </h2>
            <p>
              Les résultats fournis par notre IA sont à titre informatif uniquement et ne constituent pas une évaluation objective de votre attractivité. combiensur10.fr ne peut être tenu responsable de :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>L'interprétation ou l'utilisation des résultats</li>
              <li>Les conséquences émotionnelles liées aux résultats</li>
              <li>L'exactitude des analyses</li>
              <li>Les interruptions de service</li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              6. Propriété Intellectuelle
            </h2>
            <p>
              Tous les contenus, logos, et technologies de combiensur10.fr sont protégés par les droits d'auteur et appartiennent à leurs propriétaires respectifs.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              7. Modifications du Service
            </h2>
            <p>
              Nous nous réservons le droit de modifier ou d'interrompre le service à tout moment, avec ou sans préavis.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              8. Résiliation
            </h2>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions d'utilisation.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              9. Loi Applicable
            </h2>
            <p>
              Ces conditions sont régies par les lois françaises. Tout litige sera soumis à la juridiction exclusive des tribunaux français.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              10. Contact
            </h2>
            <p>
              Pour toute question concernant ces conditions, contactez-nous à{' '}
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
