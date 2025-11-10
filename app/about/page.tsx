import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'À propos - Combien sur 10',
  description: 'Découvrez comment fonctionne notre algorithme IA avancé pour analyser l\'attractivité faciale',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            À propos de Combien sur 10
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Notre Mission
              </h2>
              <p className="text-gray-600 mb-4">
                Combien sur 10 est une plateforme innovante qui utilise l'intelligence artificielle
                pour analyser l'attractivité faciale selon des critères scientifiques et objectifs.
                Notre objectif est de fournir une analyse ludique et éducative basée sur des
                principes reconnus en esthétique faciale.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Notre Technologie
              </h2>
              <p className="text-gray-600 mb-4">
                Notre algorithme d'analyse faciale s'appuie sur plusieurs critères scientifiques :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>
                  <strong>Symétrie faciale :</strong> La symétrie est un indicateur universel
                  d'attractivité. Notre IA compare les deux moitiés du visage pour calculer un
                  score de symétrie.
                </li>
                <li>
                  <strong>Proportions et nombre d'or :</strong> Nous analysons les proportions
                  faciales par rapport au nombre d'or (1.618), une constante mathématique
                  présente dans la nature et associée à l'harmonie esthétique.
                </li>
                <li>
                  <strong>Qualité des traits :</strong> L'espacement et la disposition des
                  éléments faciaux (yeux, nez, bouche) sont évalués selon des normes esthétiques
                  établies.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Confidentialité et Sécurité
              </h2>
              <p className="text-gray-600 mb-4">
                Nous prenons votre vie privée très au sérieux :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Les photos ne sont jamais stockées sur nos serveurs</li>
                <li>L'analyse se fait directement dans votre navigateur</li>
                <li>Seuls les résultats d'analyse sont conservés (pas les images)</li>
                <li>Conformité totale avec le RGPD</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Une Approche Équilibrée
              </h2>
              <p className="text-gray-600 mb-4">
                Nous tenons à rappeler que l'attractivité est subjective et multidimensionnelle.
                Notre score est une mesure technique basée sur des critères spécifiques et ne
                représente en aucun cas une évaluation de votre valeur en tant que personne.
              </p>
              <p className="text-gray-600 mb-4">
                L'attractivité réelle dépend de nombreux facteurs : personnalité, confiance en soi,
                sourire, expressivité, et bien d'autres qualités que notre algorithme ne peut pas
                mesurer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contactez-nous
              </h2>
              <p className="text-gray-600 mb-4">
                Des questions ou des suggestions ? N'hésitez pas à nous contacter à{' '}
                <a
                  href="mailto:contact@combiensur10.fr"
                  className="text-purple-600 hover:underline"
                >
                  contact@combiensur10.fr
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Essayer maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

