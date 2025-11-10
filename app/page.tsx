'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import * as faceapi from 'face-api.js'
import { GenderSelector } from '@/components/GenderSelector'
import { ImageUploader } from '@/components/ImageUploader'
import { analyzeFace, loadFaceApiModels } from '@/lib/face-rating'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  
  const [selectedGender, setSelectedGender] = useState<'homme' | 'femme' | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await loadFaceApiModels('/models')
        setModelsLoaded(true)
      } catch (err) {
        console.error('Error loading models:', err)
        setError('Erreur lors du chargement des modèles IA')
      }
    }
    loadModels()
  }, [])

  // Store referral code in session storage
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      sessionStorage.setItem('referralCode', ref)
    }
  }, [searchParams])

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedGender || !modelsLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      // Upload image and get hash
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('gender', selectedGender)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        if (errorData.requiresAuth) {
          router.push('/auth/signup')
          return
        }
        throw new Error(errorData.error || 'Erreur lors du téléchargement')
      }

      const { imageHash, imageData, cached, ratingId } = await uploadResponse.json()

      // If cached, redirect to existing result
      if (cached && ratingId) {
        router.push(`/result/${ratingId}`)
        return
      }

      // Perform client-side face analysis
      const img = new Image()
      img.src = imageData
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      const result = await analyzeFace(img, selectedGender, imageHash)

      // Save analysis result
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageHash,
          gender: selectedGender,
          score: result.score,
          breakdown: result.breakdown,
        }),
      })

      if (!analyzeResponse.ok) {
        throw new Error('Erreur lors de l\'analyse')
      }

      const { ratingId: newRatingId } = await analyzeResponse.json()
      router.push(`/result/${newRatingId}`)
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.message || 'Une erreur est survenue lors de l\'analyse')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Combien vaut{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              votre visage
            </span>
            {' '}?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-4"
          >
            Découvrez votre note d'attractivité en quelques secondes
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500 mb-12"
          >
            🤖 Propulsé par une IA avancée • 🔒 100% confidentiel • ⚡ Résultats instantanés
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Sélectionnez votre genre
              </h2>
              <GenderSelector
                selectedGender={selectedGender}
                onSelect={setSelectedGender}
              />
            </div>

            {selectedGender && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Téléchargez votre photo
                </h2>
                <ImageUploader
                  onImageSelect={setSelectedFile}
                  disabled={isLoading}
                />
              </motion.div>
            )}

            {selectedFile && selectedGender && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !modelsLoaded}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '🔍 Analyse en cours...' : '✨ Analyser mon visage'}
                </button>
                {!modelsLoaded && (
                  <p className="text-sm text-gray-500 mt-2">
                    Chargement des modèles IA...
                  </p>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📸"
              title="1. Téléchargez"
              description="Choisissez une photo claire de votre visage"
            />
            <FeatureCard
              icon="🤖"
              title="2. Analyse IA"
              description="Notre algorithme analyse votre symétrie, proportions et traits"
            />
            <FeatureCard
              icon="⭐"
              title="3. Résultat"
              description="Obtenez votre note sur 10 avec une analyse détaillée"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi utiliser Combien sur 10 ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <BenefitCard
              icon="🔬"
              title="Analyse scientifique"
              description="Basé sur le nombre d'or, la symétrie faciale et les proportions idéales"
            />
            <BenefitCard
              icon="🚀"
              title="Résultats instantanés"
              description="Obtenez votre note en quelques secondes seulement"
            />
            <BenefitCard
              icon="🔒"
              title="Confidentialité totale"
              description="Vos photos ne sont jamais stockées sur nos serveurs"
            />
            <BenefitCard
              icon="🎁"
              title="Essai gratuit"
              description={session ? '5 analyses gratuites' : '1 analyse gratuite sans inscription'}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Comment fonctionne l'algorithme ?"
              answer="Notre IA analyse votre visage selon plusieurs critères scientifiques : la symétrie faciale, les proportions par rapport au nombre d'or, et la qualité des traits. L'analyse est déterministe, ce qui signifie que la même photo donnera toujours le même résultat."
            />
            <FAQItem
              question="Mes photos sont-elles stockées ?"
              answer="Non, vos photos ne sont jamais stockées sur nos serveurs. L'analyse se fait directement dans votre navigateur pour garantir votre confidentialité totale."
            />
            <FAQItem
              question="Combien d'analyses puis-je faire ?"
              answer="Sans compte, vous pouvez faire 1 analyse gratuite. En créant un compte, vous recevez 5 crédits gratuits. Vous pouvez gagner plus de crédits en parrainant vos amis (10 crédits par parrainage)."
            />
            <FAQItem
              question="Le résultat est-il fiable ?"
              answer="L'analyse est basée sur des critères scientifiques reconnus. Cependant, rappelez-vous que l'attractivité est subjective et que ce score n'est qu'une mesure technique parmi d'autres."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Créez un compte pour plus d'analyses
            </h2>
            <p className="text-xl mb-8">
              Obtenez 5 crédits gratuits et gagnez-en plus en parrainant vos amis !
            </p>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              S'inscrire gratuitement
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

function BenefitCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-6 rounded-xl bg-white shadow-md">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <span className="text-2xl text-purple-600">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  )
}
