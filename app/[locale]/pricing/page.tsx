"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { PricingSection } from '@/components/pricing/PricingSection';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const t = useTranslations('pricing');
  const common = useTranslations('common');

  const faqs = [
    { question: t('faq1Question'), answer: t('faq1Answer') },
    { question: t('faq2Question'), answer: t('faq2Answer') },
    { question: t('faq3Question'), answer: t('faq3Answer') },
    { question: t('faq4Question'), answer: t('faq4Answer') },
    { question: t('faq5Question'), answer: t('faq5Answer') },
    { question: t('faq6Question'), answer: t('faq6Answer') },
    { question: t('faq7Question'), answer: t('faq7Answer') },
    { question: t('faq8Question'), answer: t('faq8Answer') },
  ];

  const testimonials = [
    { text: t('pricingTestimonial1'), name: t('pricingTestimonial1Author'), plan: 'Pro' },
    { text: t('pricingTestimonial2'), name: t('pricingTestimonial2Author'), plan: 'Premium' },
    { text: t('pricingTestimonial3'), name: t('pricingTestimonial3Author'), plan: 'Pro' },
    { text: t('pricingTestimonial4'), name: t('pricingTestimonial4Author'), plan: 'Premium' },
  ];

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
            {t('heading')}
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            {t('description')}
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
              {t('testimonialsTitle')}
            </h2>
            <p className="text-gray-400">
              {t('testimonialsSubtitle')}
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
              {t('faqTitle')}
            </h2>
            <p className="text-gray-400">
              {t('faqSubtitle')}
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
            {t('readyToStart')}
          </h2>
          <p className="text-gray-400 mb-8">
            {t('readyToStartDesc')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-10 py-4 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-xl font-light text-lg border-2 border-[#5B698B] hover:opacity-90 transition-all"
          >
            {t('viewPlans')}
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#333B4F] py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>{common('allRightsReserved')} © 2025 face10ai.com</p>
        </div>
      </footer>
    </div>
  );
}
