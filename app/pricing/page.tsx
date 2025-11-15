"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { PricingSection } from '@/components/pricing/PricingSection';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Comment fonctionne le système de crédits ?",
    answer: "Chaque analyse de visage utilise 1 crédit. Le plan gratuit vous offre 5 crédits à vie. Les plans Pro et Premium renouvellent automatiquement vos crédits chaque mois (25 pour Pro, 50 pour Premium)."
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, absolument ! Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Vous conserverez l'accès jusqu'à la fin de votre période de facturation actuelle."
  },
  {
    question: "Que se passe-t-il si je n'utilise pas tous mes crédits ?",
    answer: "Les crédits du plan gratuit n'expirent jamais. Pour les plans Pro et Premium, les crédits non utilisés ne se reportent pas au mois suivant - vous recevez un nouveau lot de crédits chaque mois."
  },
  {
    question: "La remise de 30% s'applique-t-elle uniquement au premier mois ?",
    answer: "Non ! Cette offre spéciale s'applique tant que vous maintenez votre abonnement actif. Le prix réduit sera votre tarif mensuel tant que vous restez abonné."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Toutes vos photos sont analysées localement et ne sont jamais stockées sur nos serveurs. Nous prenons votre vie privée très au sérieux et utilisons un cryptage de niveau bancaire."
  },
  {
    question: "Puis-je passer d'un plan à un autre ?",
    answer: "Oui ! Vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements seront effectués immédiatement et nous ajusterons la facturation en conséquence."
  },
  {
    question: "Y a-t-il une garantie de remboursement ?",
    answer: "Oui, nous offrons une garantie satisfait ou remboursé de 30 jours. Si vous n'êtes pas satisfait, contactez-nous pour un remboursement complet, sans poser de questions."
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons toutes les cartes de crédit et de débit majeures (Visa, Mastercard, American Express) via notre processeur de paiement sécurisé Stripe."
  }
];

const testimonials = [
  {
    text: "Le plan Pro est parfait pour moi. J'utilise environ 20 analyses par mois et le prix est vraiment raisonnable. L'IA est impressionnante !",
    name: "Marie L.",
    plan: "Pro"
  },
  {
    text: "J'ai commencé avec le plan gratuit et j'ai rapidement upgradé vers Premium. Le support VIP et les analyses détaillées en valent vraiment la peine.",
    name: "Alexandre D.",
    plan: "Premium"
  },
  {
    text: "La remise de 30% rend le service encore plus attractif. Je recommande le plan Pro à tous mes amis !",
    name: "Sophie M.",
    plan: "Pro"
  },
  {
    text: "Excellent rapport qualité-prix. Les crédits mensuels sont plus que suffisants pour mes besoins et l'analyse est toujours précise.",
    name: "Thomas B.",
    plan: "Premium"
  }
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-[#333B4F] last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-[#8096D2] transition-colors"
      >
        <span className="text-lg font-light text-white pr-8">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#8096D2] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-400 font-light leading-relaxed">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-[#040508] to-[#0C0F15]">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 w-full max-w-7xl mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h1 className="text-6xl bp3:text-4xl font-light text-white">
            Choisissez Votre Plan
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            Des tarifs transparents et flexibles pour tous vos besoins d'analyse IA. 
            Commencez gratuitement ou débloquez tout le potentiel avec nos plans premium.
          </p>
        </motion.div>
      </div>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <div className="w-full py-20 bg-gradient-to-b from-[#040508] to-[#0C0F15]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl bp3:text-3xl font-light text-white mb-4">
              Ce Que Disent Nos Clients
            </h2>
            <p className="text-gray-400">
              Rejoignez des milliers d'utilisateurs satisfaits
            </p>
          </motion.div>

          <div className="grid grid-cols-2 bp1:grid-cols-1 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-b from-[#1a1d2e] to-[#0d0f15] border border-[#333B4F]"
              >
                <p className="text-gray-300 mb-4 font-light italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-light">{testimonial.name}</span>
                  <span className="text-sm text-[#8096D2] bg-[#8096D2]/10 px-3 py-1 rounded-full">
                    Plan {testimonial.plan}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full py-20 bg-gradient-to-b from-[#0C0F15] to-[#040508]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl bp3:text-3xl font-light text-white mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-gray-400">
              Tout ce que vous devez savoir sur nos plans et tarifs
            </p>
          </motion.div>

          <div className="bg-gradient-to-b from-[#0d0f15] to-[#040508] border border-[#333B4F] rounded-2xl p-8">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-20 bg-gradient-to-b from-[#040508] to-[#0C0F15]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto px-4"
        >
          <h2 className="text-4xl bp3:text-3xl font-light text-white mb-4">
            Prêt à Commencer ?
          </h2>
          <p className="text-gray-400 mb-8">
            Rejoignez des milliers d'utilisateurs qui font confiance à notre IA 
            pour analyser leur attractivité avec précision.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-10 py-4 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-xl font-light text-lg border-2 border-[#5B698B] hover:opacity-90 transition-all"
          >
            Voir les Plans
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#333B4F] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Tous droits réservés © 2025 face10ai.com</p>
        </div>
      </footer>
    </div>
  );
}

