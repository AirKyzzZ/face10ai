import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-light text-white mb-6">
            À propos de combiensur10.fr
          </h1>

          <div className="space-y-6 text-gray-300 font-light leading-relaxed">
            <p>
              <strong className="text-white">combiensur10.fr</strong> est une plateforme d'analyse faciale basée sur l'intelligence artificielle qui évalue l'attractivité selon des critères scientifiques reconnus.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              Notre Méthodologie
            </h2>

            <p>
              Notre IA analyse votre visage selon trois critères principaux :
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">La Symétrie Faciale</strong> - L'équilibre entre les côtés gauche et droit de votre visage, un indicateur clé d'attractivité selon de nombreuses études scientifiques.
              </li>
              <li>
                <strong className="text-white">Le Nombre d'Or</strong> - Les proportions idéales basées sur le ratio de 1,618, utilisé depuis l'Antiquité pour définir la beauté harmonieuse.
              </li>
              <li>
                <strong className="text-white">La Qualité des Traits</strong> - L'espacement et la définition des caractéristiques faciales selon des critères optimaux.
              </li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              Technologie
            </h2>

            <p>
              Nous utilisons <strong className="text-white">face-api.js</strong>, une bibliothèque de détection faciale avancée basée sur des réseaux de neurones profonds. L'analyse se fait entièrement dans votre navigateur, garantissant que vos photos ne sont jamais envoyées sur nos serveurs.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              Confidentialité
            </h2>

            <p>
              Votre vie privée est notre priorité. Les images sont traitées localement dans votre navigateur et ne sont jamais stockées. Seuls les résultats de l'analyse (scores et statistiques) sont sauvegardés, sans aucune image associée.
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              Contact
            </h2>

            <p>
              Pour toute question ou suggestion, n'hésitez pas à nous contacter à{' '}
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
