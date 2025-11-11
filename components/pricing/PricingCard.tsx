"use client";

import { motion } from 'framer-motion';
import { Check, Zap, Crown, Gift } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PricingCardProps {
  tier: 'FREE' | 'PRO' | 'PREMIUM';
  title: string;
  price: string;
  originalPrice?: string;
  credits: number;
  features: string[];
  isPopular?: boolean;
  index: number;
}

export function PricingCard({
  tier,
  title,
  price,
  originalPrice,
  credits,
  features,
  isPopular,
  index,
}: PricingCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isCurrentPlan = session?.user?.subscriptionTier === tier;
  const isFree = tier === 'FREE';
  const isActiveSubscription = isCurrentPlan && !isFree && session?.user?.subscriptionStatus === 'active';

  const handleSubscribe = async () => {
    if (isFree) {
      router.push('/auth/signup');
      return;
    }

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (isCurrentPlan) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Erreur lors de la création de l\'abonnement');
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Vous garderez vos crédits actuels jusqu\'à la fin de la période.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Abonnement annulé. Valide jusqu'au ${new Date(data.endsAt).toLocaleDateString()}`);
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Cancel error:', error);
      alert(error.message || 'Erreur lors de l\'annulation');
    } finally {
      setIsCancelling(false);
    }
  };

  const getIcon = () => {
    if (tier === 'FREE') return <Gift className="w-6 h-6" />;
    if (tier === 'PRO') return <Zap className="w-6 h-6" />;
    return <Crown className="w-6 h-6" />;
  };

  const getButtonText = () => {
    if (isCurrentPlan) return 'Plan Actuel';
    if (isFree) return 'Commencer Gratuitement';
    if (!session) return 'Choisir ce Plan';
    return 'S\'abonner Maintenant';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative flex flex-col p-8 rounded-2xl border-2 ${
        isPopular
          ? 'border-[#8096D2] bg-gradient-to-b from-[#1a1d2e] to-[#0d0f15] scale-105 bp3:scale-100'
          : 'border-[#333B4F] bg-gradient-to-b from-[#0d0f15] to-[#040508]'
      } hover:border-[#8096D2] transition-all duration-300`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#5B698B] to-[#8096D2] rounded-full">
          <span className="text-white text-sm font-semibold">Plus Populaire</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isPopular ? 'bg-[#8096D2]/20' : 'bg-[#5B698B]/20'
          }`}>
            {getIcon()}
          </div>
          <h3 className="text-2xl font-light text-white">{title}</h3>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-gray-500 line-through text-xl">{originalPrice}</span>
          )}
          <span className="text-5xl font-bold bg-gradient-to-b from-[#8096D2] to-[#b7b9be] bg-clip-text text-transparent">
            {price}
          </span>
          {!isFree && <span className="text-gray-400 text-lg">/mois</span>}
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {credits} crédits {tier === 'FREE' ? 'à vie' : 'par mois'}
        </p>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#8096D2] flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm font-light">{feature}</span>
          </li>
        ))}
      </ul>

      {isActiveSubscription ? (
        // Cancel button for active subscriptions
        <motion.button
          onClick={handleCancel}
          disabled={isCancelling}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl font-light text-lg transition-all bg-gradient-to-b from-red-600 to-red-800 text-white border-2 border-red-500 hover:opacity-90 disabled:opacity-50"
        >
          {isCancelling ? 'Annulation...' : 'Annuler l\'Abonnement'}
        </motion.button>
      ) : (
        // Subscribe button
        <motion.button
          onClick={handleSubscribe}
          disabled={isCurrentPlan || isLoading}
          whileHover={!isCurrentPlan ? { scale: 1.02 } : {}}
          whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
          className={`w-full py-4 rounded-xl font-light text-lg transition-all ${
            isCurrentPlan
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : isPopular
              ? 'bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white border-2 border-[#5B698B] hover:opacity-90'
              : 'bg-gradient-to-b from-black to-[rgb(65,64,64)] text-white border-2 border-[#5B698B] hover:border-[#8096D2]'
          } disabled:opacity-50`}
        >
          {isLoading ? 'Chargement...' : getButtonText()}
        </motion.button>
      )}

      {!isFree && !isCurrentPlan && (
        <p className="text-center text-xs text-gray-500 mt-3">
          Annulation possible à tout moment
        </p>
      )}
      
      {isCurrentPlan && session?.user?.subscriptionStatus === 'canceled' && (
        <p className="text-center text-xs text-yellow-500 mt-3">
          Abonnement annulé - Valide jusqu'à la fin de la période
        </p>
      )}
    </motion.div>
  );
}

