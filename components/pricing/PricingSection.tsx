"use client";

import { motion } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';
import { PricingCard } from './PricingCard';
import { HoverBorderGradient } from '@/components/template/FramerButton';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

const pricingTiers = [
  {
    tier: 'FREE' as const,
    title: 'Gratuit',
    price: {
      monthly: '0€',
      annual: '0€',
    },
    credits: 5,
    features: [
      '5 analyses gratuites à vie',
      'Analyse IA de base',
      'Résultats instantanés',
      'Confidentialité garantie',
      'Partage des résultats',
    ],
  },
  {
    tier: 'PRO' as const,
    title: 'Pro',
    price: {
      monthly: '6,99€',
      annual: '69,99€',
    },
    originalPrice: {
      monthly: '9,99€',
      annual: '119,88€',
    },
    credits: 25,
    features: [
      '25 analyses par mois',
      'Analyse IA avancée',
      'Résultats détaillés premium',
      'Support prioritaire',
      'Historique complet',
      'Analyses illimitées du passé',
      'Badge exclusif PRO',
    ],
    isPopular: true,
  },
  {
    tier: 'PREMIUM' as const,
    title: 'Premium',
    price: {
      monthly: '13,99€',
      annual: '139,99€',
    },
    originalPrice: {
      monthly: '19,99€',
      annual: '239,88€', // 19.99 * 12
    },
    credits: 50,
    features: [
      '50 analyses par mois',
      'Analyse IA ultra-précise',
      'Rapports détaillés exclusifs',
      'Support VIP 24/7',
      'Accès anticipé aux nouveautés',
      'API personnalisée',
      'Conseils personnalisés IA',
      'Badge PREMIUM doré',
    ],
  },
];

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');

  // Helper function to get monthly equivalent of annual price
  const getMonthlyEquivalent = (annualPrice: string): string => {
    const numericPrice = parseFloat(annualPrice.replace(',', '.').replace('€', '').trim());
    const monthlyEquivalent = numericPrice / 12;
    return `${monthlyEquivalent.toFixed(2).replace('.', ',')}€`;
  };

  // Helper function to get display price based on billing period
  const getDisplayPrice = (tier: typeof pricingTiers[0]): string => {
    if (tier.tier === 'FREE') return tier.price[billingPeriod];
    if (billingPeriod === 'annual') {
      return getMonthlyEquivalent(tier.price.annual);
    }
    return tier.price.monthly;
  };

  // Helper function to get display original price based on billing period
  const getDisplayOriginalPrice = (tier: typeof pricingTiers[0]): string | undefined => {
    if (!tier.originalPrice) return undefined;
    if (billingPeriod === 'annual') {
      return getMonthlyEquivalent(tier.originalPrice.annual);
    }
    return tier.originalPrice.monthly;
  };

  return (
    <div id="pricing" className="flex flex-col bg-gradient-to-b from-[#0C0F15] to-[#040508] justify-center items-center w-full relative py-32 bp3:py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[700px] h-[700px] bg-grid-white/[0.05] bg-[length:50px_50px]"
          style={{
            maskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
            WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#293249] to-transparent opacity-40 blur-3xl pointer-events-none" />

      {/* Section Badge */}
      <div className="flex justify-center text-center z-10 mb-8">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        >
          <span>Tarifs</span>
        </HoverBorderGradient>
      </div>

      {/* Header */}
      <div className="w-[85%] max-w-5xl flex flex-col items-center justify-center relative z-10 mb-8">
        <div className="absolute inset-x-0 top-[-50px] z-0 flex justify-center pointer-events-none">
          <div
            className="absolute w-[400px] h-[200px] bg-[#5B698B]/40 opacity-80 blur-[80px]"
            style={{ borderRadius: "50%" }}
          />
          <div
            className="absolute w-[300px] h-[150px] bg-[#5B698B]/50 opacity-80 blur-[100px]"
            style={{ borderRadius: "50%" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4"
        >
          <Sparkles className="w-6 h-6 text-[#8096D2]" />
          <span className="text-2xl bp3:text-xl font-bold bg-gradient-to-r from-[#8096D2] to-[#b7b9be] bg-clip-text text-transparent">
            OFFRE LIMITÉE - 30% DE RÉDUCTION
          </span>
          <Sparkles className="w-6 h-6 text-[#8096D2]" />
        </motion.div>

        <p className="text-5xl bp3:text-2xl bp4:text-3xl text-center font-light mb-2">
          L'offre se termine dans
        </p>

        <div className="relative flex items-center w-full justify-center mt-1 mb-4 pointer-events-none">
          <div className="absolute -left-40 h-[1px] w-[30%] bg-gradient-to-l to-black from-[#8096D2]" />
          <div className="absolute -right-40 h-[1px] w-[30%] bg-gradient-to-r to-black from-[#8096D2]" />
        </div>

        {/* Countdown Timer */}
        <div className="my-8">
          <CountdownTimer />
        </div>

        <p className="text-center text-gray-400 max-w-2xl mt-4">
          Ne manquez pas cette opportunité unique ! Profitez de notre remise exceptionnelle de 30% 
          et débloquez tout le potentiel de notre IA d'analyse.
        </p>
      </div>

      {/* Billing Period Toggle */}
      <div className="flex flex-col items-center justify-center gap-3 mb-8 z-10">
        {billingPeriod === 'annual' && (
          <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-semibold rounded-full">
            Économisez jusqu'à 30%
          </span>
        )}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
            Mensuel
          </span>
          <button
            type="button"
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-gradient-to-r from-[#5B698B] to-[#8096D2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8096D2] focus:ring-offset-2 focus:ring-offset-[#0C0F15]"
            role="switch"
            aria-checked={billingPeriod === 'annual'}
            aria-label="Toggle billing period"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${billingPeriod === 'annual' ? 'text-white' : 'text-gray-500'}`}>
            Annuel
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-3 bp1:grid-cols-1 gap-8 bp3:gap-6 w-[90%] max-w-6xl mt-12 z-10">
        {pricingTiers.map((tier, index) => (
          <PricingCard 
            key={tier.tier} 
            tier={tier.tier}
            title={tier.title}
            price={getDisplayPrice(tier)}
            originalPrice={getDisplayOriginalPrice(tier)}
            credits={tier.credits}
            features={tier.features}
            isPopular={tier.isPopular}
            index={index}
            billingPeriod={billingPeriod}
          />
        ))}
      </div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center z-10"
      >
        <p className="text-gray-400 text-sm mb-2">
          Rejoignez plus de <span className="text-[#8096D2] font-semibold">2 000+ utilisateurs</span> satisfaits
        </p>
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-gray-400 text-sm">4.9/5 basé sur 287 avis</span>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-8 mt-12 z-10 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Paiement Sécurisé</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Satisfait ou Remboursé 30j</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
          <span>Annulation en 1 Clic</span>
        </div>
      </div>
    </div>
  );
}

