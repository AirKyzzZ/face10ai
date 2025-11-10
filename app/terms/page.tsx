import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation - Combien sur 10',
  description: 'Conditions générales d\'utilisation de Combien sur 10',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Conditions d'utilisation
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptation des conditions
              </h2>
              <p>
                En utilisant Combien sur 10, vous acceptez ces conditions d'utilisation dans leur
                intégralité. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description du service
              </h2>
              <p>
                Combien sur 10 est une plateforme d'analyse faciale qui utilise l'intelligence
                artificielle pour évaluer l'attractivité faciale selon des critères techniques
                et scientifiques. Le service est fourni à titre ludique et éducatif.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Utilisation acceptable
              </h2>
              <p>Vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir des informations exactes lors de l'inscription</li>
                <li>Utiliser le service de manière légale et éthique</li>
                <li>Ne pas télécharger de photos de mineurs sans autorisation parentale</li>
                <li>Ne pas télécharger de contenu inapproprié ou offensant</li>
                <li>Ne pas tenter de contourner nos systèmes de sécurité</li>
                <li>Ne pas automatiser l'utilisation du service (bots, scripts)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Système de crédits
              </h2>
              <p>
                Notre plateforme fonctionne avec un système de crédits :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Les utilisateurs anonymes reçoivent 1 analyse gratuite</li>
                <li>Les utilisateurs inscrits reçoivent 5 crédits gratuits</li>
                <li>Des crédits supplémentaires peuvent être gagnés via le parrainage</li>
                <li>Les crédits n'ont pas de valeur monétaire et ne peuvent être échangés</li>
                <li>Nous nous réservons le droit de modifier le système de crédits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Propriété intellectuelle
              </h2>
              <p>
                Tous les contenus, designs, logos, et technologies de Combien sur 10 sont
                protégés par les droits d'auteur et autres droits de propriété intellectuelle.
                Vous ne pouvez pas copier, modifier ou distribuer ces éléments sans autorisation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Exactitude des résultats
              </h2>
              <p className="font-semibold text-purple-600">
                AVERTISSEMENT IMPORTANT :
              </p>
              <p>
                Les résultats fournis par notre algorithme sont basés sur des critères techniques
                et ne constituent en aucun cas une évaluation objective ou définitive de
                l'attractivité d'une personne. L'attractivité est subjective et dépend de nombreux
                facteurs que notre système ne peut pas mesurer.
              </p>
              <p>
                Nous ne garantissons pas l'exactitude, la fiabilité ou l'exhaustivité des résultats.
                Les scores doivent être pris avec légèreté et ne doivent pas affecter votre
                estime de soi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Limitation de responsabilité
              </h2>
              <p>
                Combien sur 10 et ses créateurs ne peuvent être tenus responsables de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tout préjudice émotionnel ou psychologique résultant de l'utilisation du service</li>
                <li>Les décisions prises sur la base des résultats fournis</li>
                <li>Les interruptions de service ou erreurs techniques</li>
                <li>La perte de données ou de crédits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Résiliation
              </h2>
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de
                violation de ces conditions d'utilisation, sans préavis et sans remboursement.
              </p>
              <p className="mt-4">
                Vous pouvez supprimer votre compte à tout moment depuis vos paramètres. La
                suppression est définitive et entraîne la perte de tous vos crédits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Modifications
              </h2>
              <p>
                Nous nous réservons le droit de modifier ces conditions d'utilisation à tout
                moment. Les modifications entreront en vigueur dès leur publication. Votre
                utilisation continue du service après modification constitue votre acceptation
                des nouvelles conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Droit applicable
              </h2>
              <p>
                Ces conditions sont régies par le droit français. Tout litige sera soumis à la
                juridiction exclusive des tribunaux français.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact
              </h2>
              <p>
                Pour toute question concernant ces conditions, contactez-nous à{' '}
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

