'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Header from '@/components/Header'

export default function TermsPage() {
  const t = useTranslations('terms')
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
            <p className="text-sm text-gray-400">
              {t('lastUpdated')} {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section1Title')}
            </h2>
            <p>{t('section1Content')}</p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section2Title')}
            </h2>
            <p>{t('section2Content')}</p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section3Title')}
            </h2>
            <p>{t('section3Content')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t.raw('section3Items') as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section4Title')}
            </h2>
            <p>{t('section4Content')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t.raw('section4Items') as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section5Title')}
            </h2>
            <p>{t('section5Content')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t.raw('section5Items') as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section6Title')}
            </h2>
            <p>{t('section6Content')}</p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section7Title')}
            </h2>
            <p>{t('section7Content')}</p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section8Title')}
            </h2>
            <p>{t('section8Content')}</p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section9Title')}
            </h2>
            <p>{t('section9Content')}</p>

            <h2 className="text-2xl font-light text-white mt-8 mb-4">
              {t('section10Title')}
            </h2>
            <p>
              {t('section10Content')}{' '}
              <a
                href="mailto:contact@face10ai.com"
                className="text-[#8096D2] hover:underline"
              >
                contact@face10ai.com
              </a>
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
