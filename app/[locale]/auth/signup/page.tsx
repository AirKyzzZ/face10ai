'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'

export default function SignUpPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const common = useTranslations('common')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get referral code from sessionStorage
    const storedCode = sessionStorage.getItem('referralCode')
    if (storedCode) {
      setReferralCode(storedCode)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }

    if (password.length < 6) {
      setError(t('passwordTooShort'))
      return
    }

    setIsLoading(true)

    try {
      // Create user
      const signupRes = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          referralCode: referralCode || null,
        }),
      })

      const signupData = await signupRes.json()

      if (!signupRes.ok) {
        throw new Error(signupData.error || t('errorOccurred'))
      }

      // Clear referral code from sessionStorage
      sessionStorage.removeItem('referralCode')

      // Sign in automatically
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(t('errorOccurred'))
        router.push('/auth/signin')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errorOccurred'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-[#2E3139] to-[#1E2536] border-[2px] border-[#5B698B] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-light text-white mb-2 text-center">
            {t('signup')}
          </h1>
          <p className="text-gray-400 text-center mb-8 font-light">
            {t('signupSubtitle')}
          </p>

          {referralCode && (
            <div className="mb-6 p-3 bg-green-900/20 border border-green-500/50 rounded-lg text-green-300 text-sm text-center">
              {t('referralBonus')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-light text-gray-300 mb-2">
                {t('name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-[#5B698B] rounded-lg text-white focus:outline-none focus:border-[#8096D2] transition-colors"
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-300 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-[#5B698B] rounded-lg text-white focus:outline-none focus:border-[#8096D2] transition-colors"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-300 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-[#5B698B] rounded-lg text-white focus:outline-none focus:border-[#8096D2] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-300 mb-2">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-[#5B698B] rounded-lg text-white focus:outline-none focus:border-[#8096D2] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-lg font-light hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('creating') : t('createMyAccount')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm font-light">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/auth/signin"
                className="text-[#8096D2] hover:underline"
              >
                {t('signIn')}
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-gray-500 text-sm font-light hover:text-gray-300 transition-colors"
            >
              ← {common('backToHome')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
