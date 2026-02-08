'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Header from '@/components/Header'

export default function AboutPage() {
  const t = useTranslations('about')
  const common = useTranslations('common')

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-light text-white mb-6">
            {t('title')}
          </h1>

          <div className="space-y-6 text-gray-300 font-light leading-relaxed">
            <p>
              {t('description')}
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('methodologyTitle')}
            </h2>

            <p>
              {t('methodologyDesc')}
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">{t('criteria1')}</strong> - {t('criteria1Desc')}
              </li>
              <li>
                <strong className="text-white">{t('criteria2')}</strong> - {t('criteria2Desc')}
              </li>
              <li>
                <strong className="text-white">{t('criteria3')}</strong> - {t('criteria3Desc')}
              </li>
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('technologyTitle')}
            </h2>

            <p>
              {t('technologyDesc')}
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('privacyTitle')}
            </h2>

            <p>
              {t('privacyDesc')}
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-xl font-light hover:opacity-90 transition-opacity"
            >
              {common('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
