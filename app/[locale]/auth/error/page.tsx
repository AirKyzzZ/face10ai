'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const t = useTranslations('authError')
  const common = useTranslations('common')
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return t('configError')
      case 'AccessDenied':
        return t('accessDenied')
      case 'Verification':
        return t('verificationExpired')
      default:
        return t('genericError')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-8 shadow-2xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-900/20 border-2 border-red-500/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-light text-white mb-4">
            {t('title')}
          </h1>

          <p className="text-gray-300 mb-8 font-light">
            {getErrorMessage(error)}
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full py-3 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-lg font-light hover:opacity-90 transition-opacity"
            >
              {common('retry')}
            </Link>

            <Link
              href="/"
              className="block w-full py-3 text-gray-400 hover:text-white transition-colors font-light"
            >
              {common('backToHome')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
