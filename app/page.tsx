/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from "framer-motion";
import * as faceapi from 'face-api.js'

import Header from "@/components/Header";
import { ImageUploader } from '@/components/ImageUploader'
import { analyzeFace, loadFaceApiModels } from '@/lib/face-rating'
import { HoverBorderGradient } from "@/components/template/FramerButton";
import { BorderBeam } from "@/components/magicui/border-beam";
import LogoMarquee from "@/components/template/marquee";
import GlowingAdSenseCard from "@/components/template/Social";
import BentoGrid from "@/components/template/bento-grid";
import Grid from "@/components/template/grid";
import Grid2 from "@/components/template/grid2";
import { PricingSection } from "@/components/pricing/PricingSection";

import {
  Scan,
  Brain,
  Lock,
  Zap,
  TrendingUp,
  Shield,
  Mail,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isHovered1, setIsHovered1] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  // Load face detection models (client-side, lightweight)
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading face detection models...')
        await loadFaceApiModels('/models')
        console.log('✅ Face detection ready!')
        setModelsLoaded(true)
      } catch (err) {
        console.error('Error loading face detection models:', err)
        setError('Erreur lors du chargement des modèles de détection')
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
    if (!selectedFile || !modelsLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      // Upload image and get hash
      const formData = new FormData()
      formData.append('image', selectedFile)

      let uploadResponse
      try {
        uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
      } catch (networkError: any) {
        // Handle network errors (connection refused, timeout, etc.)
        console.error('Network error:', networkError)
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.')
      }

      if (!uploadResponse.ok) {
        let errorMessage = 'Erreur lors du téléchargement'
        try {
          const errorData = await uploadResponse.json()
          if (errorData.requiresAuth) {
            router.push('/auth/signup')
            return
          }
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = uploadResponse.statusText || errorMessage
        }
        throw new Error(errorMessage)
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

      const result = await analyzeFace(img, imageHash)

      // Save analysis result
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageHash,
          score: result.score,
          breakdown: result.breakdown,
        }),
      })

      if (!analyzeResponse.ok) {
        let errorMessage = 'Erreur lors de l\'analyse'
        try {
          const errorData = await analyzeResponse.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          errorMessage = analyzeResponse.statusText || errorMessage
        }
        throw new Error(errorMessage)
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
    <div className="relative min-h-screen w-full h-full flex flex-col items-center overflow-hidden">
      <Header />

      {/* White Grid in Hero Section */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[700px] h-[700px] bg-grid-white/[0.2] bg-[length:50px_50px]"
          style={{
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 w-full max-w-7xl mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 flex flex-col gap-8 items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <span className="relative px-4 py-2 rounded-xl flex flex-row gap-2 items-center bg-white/10 text-sm text-white/90 backdrop-blur-sm border border-white/10 overflow-hidden">
              <motion.div
                className="absolute top-0 w-[10px] h-full bg-blue-300 opacity-60 blur-md shadow-2xl"
                initial={{ left: "-10%" }}
                animate={{ left: "110%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
              />
              <Brain className="w-4 h-4 relative z-10" />
              <p className="relative z-10">
                DÉCOUVREZ VOTRE NOTE D'ATTRACTIVITÉ AVEC L'IA
              </p>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-8xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <motion.span
              className="text-[#d0d2d8] bp3:text-6xl text-8xl font-light relative flex space-x-1 justify-center"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {"face10ai.com".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className={`inline-block ${
                    char === "1" || char === "0"
                      ? "font-semibold"
                      : ""
                  }`}
                  animate={
                    isHovered
                      ? {
                          textShadow: "0px 0px 20px rgba(142, 146, 156, 1)",
                          color: "#d9dbdf",
                        }
                      : {
                          textShadow: "0px 0px 0px rgba(142, 146, 156, 0)",
                          color: "white",
                        }
                  }
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-[15px] text-white"
          >
            Notre intelligence artificielle, entraînée sur des milliers de visages, analyse votre attractivité avec une précision inégalée. Obtenez votre note personnalisée en quelques secondes grâce à notre modèle d'apprentissage profond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4 flex flex-col items-center justify-center"
          >
            <HoverBorderGradient className="bg-gradient-to-b from-[rgb(91,105,139)] to-[#828282] px-6 font-extralight py-3 text-[16]">
              Commencer l'Analyse
            </HoverBorderGradient>
            <p className="text-sm text-white/50">
                Essai gratuit sans création de compte • Résultats instantanés • 100% confidentiel
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Product Demo Section - Face Upload Interface */}
      <div className="min-h-screen mt-32 w-full h-full flex flex-col items-center overflow-hidden relative bg-gradient-to-b from-[#040508] to-[#0C0F15]">
        <div className="w-[85%] max-w-6xl relative flex flex-col items-center justify-center bg-black bp4:min-h-[600px] bp3:min-h-[500px] min-h-[700px] rounded-2xl overflow-hidden p-8">
          {/* Animated Border Effects */}
          <BorderBeam
            duration={6}
            size={1000}
            className="from-transparent via-red-500 to-transparent"
          />
          <BorderBeam
            duration={6}
            delay={3}
            size={1000}
            className="from-transparent via-blue-500 to-transparent"
          />

          {/* Product Interface */}
          <div className="relative z-10 w-full space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-light text-white mb-6 text-center">
                Téléchargez votre photo
              </h2>
              <ImageUploader
                onImageSelect={setSelectedFile}
                disabled={isLoading}
              />
            </motion.div>

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !modelsLoaded}
                  className="px-10 py-4 bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] text-white rounded-xl font-light text-lg hover:opacity-90 transition-all border-2 border-[#5B698B] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '🔍 Analyse en cours...' : '✨ Analyser mon visage'}
                </button>
                {!modelsLoaded && (
                  <p className="text-sm text-gray-400 font-light">
                    Chargement des modèles IA...
                  </p>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-center"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>

        <div className="w-full mt-8">
          <LogoMarquee />
        </div>
      </div>

      {/* Works with Section */}
      <div className="min-h-screen w-full h-full flex flex-col z-0 items-center relative bg-gradient-to-b from-[#0C0F15] to-[#0C0F16]">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[700px] h-[700px] bg-grid-black/[0.9] dark:bg-grid-white/[0.05] bg-[length:50px_50px]"
            style={{
              maskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
              WebkitMaskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
            }}
          />
        </div>

        <div className="flex flex-col justify-center mt-14 items-center w-full relative z-10">
          <p className="text-[16px] text-gray-200">Technologie utilisée par: </p>
          <GlowingAdSenseCard />
        </div>

        {/* Features Section */}
        <div className="flex mt-20 flex-col bg-transparent justify-center items-center w-full relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#293249] to-transparent opacity-40 blur-3xl pointer-events-none"></div>

          <div className="flex justify-center text-center bp1:mt-32 bp4:mt-44 mt-0 z-10">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <span>Fonctionnalités</span>
            </HoverBorderGradient>
          </div>

          <div className="w-[85%] max-w-5xl flex flex-col mt-8 items-center justify-center relative z-10">
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
            <p className="text-5xl bp3:text-xl bp4:text-3xl text-center font-light">
              Caractéristiques Avancées pour une
            </p>

            <div className="relative flex items-center w-full justify-center mt-1 pointer-events-none">
              <div className="absolute -left-40 h-[1px] w-[30%] bg-gradient-to-l to-black from-[#8096D2]"></div>
              <div className="absolute -right-40 h-[1px] w-[30%] bg-gradient-to-r to-black from-[#8096D2]"></div>
            </div>

            <p className="text-5xl bp4:text-3xl bp3:text-xl text-center mt-2 bg-gradient-to-b from-[#8096D2] to-[#b7b9be] bg-clip-text text-transparent font-light leading-tight">
              Analyse Basée sur l'IA
            </p>
          </div>

          <BentoGrid />
        </div>

        {/* Services Section */}
        <div className="flex bp6:-mt-48 -mt-24 flex-col bg-transparent bg-gradient-to-b to-[#040508] from-[#0C0F15] justify-center items-center w-full relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#293249] to-transparent opacity-40 blur-3xl pointer-events-none"></div>

          <div className="flex justify-center text-center z-10">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <span>Services</span>
            </HoverBorderGradient>
          </div>

          <div className="w-[85%] max-w-5xl flex flex-col mt-8 items-center justify-center relative z-10">
            <p className=" text-5xl bp3:text-xl bp4:text-3xl text-center font-light">
              Services Innovants
            </p>

            <div className="relative flex items-center w-full justify-center mt-1 pointer-events-none">
              <div className="absolute -left-40 h-[1px] w-[40%] bg-gradient-to-l to-black from-[#8096D2]"></div>
              <div className="absolute -right-40 h-[1px] w-[40%] bg-gradient-to-r to-black from-[#8096D2]"></div>
            </div>

            <p className="text-5xl bp3:text-xl bp4:text-3xl text-center mt-2 bg-gradient-to-b from-[#8096D2] to-[#b7b9be] bg-clip-text text-transparent font-light leading-tight">
              Pour Votre Beauté
            </p>
          </div>

          <div className="grid grid-cols-3 bp1:grid-cols-2 bp6:grid-cols-1 mt-14 gap-0 mb-10">
            <Grid
              title={"Analyse Intelligente"}
              text={
                "Notre modèle d'IA a été entraîné sur des milliers de visages pour évaluer votre attractivité avec une précision exceptionnelle."
              }
            >
              <Scan className="w-20 h-20" />
            </Grid>
            <Grid
              title={"Apprentissage Profond"}
              text={
                "Notre réseau neuronal avancé identifie les caractéristiques faciales qui déterminent l'attractivité selon des milliers d'exemples réels."
              }
            >
              <TrendingUp className="w-20 h-20" />
            </Grid>
            <Grid
              title={"Notation par IA"}
              text={
                "Recevez une note précise générée par notre intelligence artificielle entraînée sur une base de données massive de visages humains."
              }
            >
              <Brain className="w-20 h-20" />
            </Grid>
            <Grid
              title={"Confidentialité Totale"}
              text={
                "Vos photos ne sont jamais stockées sur nos serveurs. L'analyse se fait localement pour garantir votre vie privée."
              }
            >
              <Lock className="w-20 h-20" />
            </Grid>
            <Grid
              title={"Résultats Instantanés"}
              text={
                "Recevez votre analyse complète en quelques secondes grâce à notre technologie optimisée et performante."
              }
            >
              <Zap className="w-20 h-20" />
            </Grid>
            <Grid
              title={"Intelligence Artificielle"}
              text={
                "Notre modèle utilise l'apprentissage automatique pour analyser des milliers de caractéristiques faciales et fournir une évaluation fiable."
              }
            >
              <Shield className="w-20 h-20" />
            </Grid>
          </div>

          <div className="flex justify-center text-center bg-gradient-to-b from-[#040508] to-[#0C0F15] z-10">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black border-[1px] border-[#5A678A] bg-white text-black dark:text-white flex items-center space-x-2"
              style={{ background: "linear-gradient(to bottom, black, white)" }}
            >
              <span className="text-xl font-light">Lorem Ipsum</span>
            </HoverBorderGradient>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="flex pt-32 flex-col bg-gradient-to-b from-[#040508] to-[#0C0F15] bg-transparent justify-center items-center w-full relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#293249] to-transparent opacity-40 blur-3xl pointer-events-none"></div>

          <div className="flex justify-center text-center z-10">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <span>Témoignages</span>
            </HoverBorderGradient>
          </div>

          <div className="w-[85%] max-w-5xl flex flex-col mt-7  items-center justify-center relative z-10">
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
            <p className=" text-5xl bp3:text-xl bp4:text-3xl text-center font-light">
              Approuvé Par
            </p>

            <div className="relative flex items-center w-full justify-center mt-1 pointer-events-none">
              <div className="absolute -left-40 h-[1px] w-[50%] bg-gradient-to-l to-black from-[#8096D2]"></div>
              <div className="absolute -right-40 h-[1px] w-[50%] bg-gradient-to-r to-black from-[#8096D2]"></div>
            </div>

            <p className="text-5xl bp3:text-xl bp4:text-3xl text-center mt-2 bg-gradient-to-b from-[#8096D2] to-[#b7b9be] bg-clip-text text-transparent font-light leading-tight">
              Nos Utilisateurs Satisfaits
            </p>
          </div>

          <p className="text-sm font-light mt-8">
            Découvrez ce qu'ils pensent de notre service
          </p>

          <div className="grid grid-cols-3 bp1:grid-cols-2 bp6:grid-cols-1 mt-14 gap-4 mb-10">
            <Grid2
              text="J'étais curieux de connaître ma note et les résultats étaient très détaillés ! L'IA est vraiment impressionnante, on voit qu'elle a été bien entraînée."
              name="Marc, 28 ans - Paris"
            />
            <Grid2
              text="Application fascinante qui utilise une vraie intelligence artificielle. Savoir que l'IA a été entraînée sur des milliers de visages rassure sur la fiabilité."
              name="Sophie, 24 ans - Lyon"
            />
            <Grid2
              text="Rapide, précis et totalement confidentiel. La technologie d'IA derrière est vraiment poussée, les résultats sont cohérents !"
              name="Thomas, 31 ans - Marseille"
            />
            <Grid2
              text="Une expérience vraiment unique ! On sent que le modèle d'IA a appris sur une énorme base de données. Les résultats sont bluffants."
              name="Emma, 26 ans - Bordeaux"
            />
            <Grid2
              text="J'ai testé avec mes amis et on a tous été surpris par la précision de l'IA. Le système de parrainage est génial !"
              name="Lucas, 29 ans - Toulouse"
            />
            <Grid2
              text="Excellente application basée sur l'intelligence artificielle. Les résultats instantanés et le respect de la vie privée sont parfaits."
              name="Léa, 25 ans - Nantes"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <PricingSection />

        {/* Contact/CTA Section */}
        <div className="flex w-full mt-32 flex-col bg-gradient-to-b to-[#040508] from-[#0C0F15] bg-transparent justify-center items-center relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#293249] to-transparent opacity-40 blur-3xl pointer-events-none"></div>

          <div className="flex justify-center text-center z-10">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <span>Nous contacter</span>
            </HoverBorderGradient>
          </div>
          <div className="w-[90%] max-w-6xl mt-10 mb-10 gap-20 flex bp7:flex-col flex-row items-center justify-evenly">
            <div className="flex flex-col relative ">
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

              <p className="text-4xl font-light">Une question à nous poser ?</p>
              <p className="text-4xl bg-gradient-to-b from-[#8096D2] to-[#b7b9be] bg-clip-text text-transparent font-light leading-tight">
                Contactez-nous dès maintenant
              </p>
              <p className="font-light text-sm mt-8">
                Que vous ayez une question ou que vous soyez prêt à discuter
              </p>
              <p className="font-light text-sm">
                de votre expérience, nous sommes là pour vous aider !
              </p>

              <div className="mt-8 flex flex-row gap-3 items-end">
                <Mail className="w-6 h-6 text-[#8096D2]" />
                <p className="font-light text-sm">contact@face10ai.com</p>
              </div>
              <div className="mt-8 flex flex-row gap-3 items-end">
                <MapPin className="w-6 h-6 text-[#8096D2]" />
                <p className="font-light text-sm">Bordeaux, France</p>
              </div>
            </div>

            <div className="flex bp7:hidden gap-4 flex-col">
              <div className="flex flex-col">
                <p className="font-light text-sm">Nom</p>
                <input
                  className="w-[500px] bp7:w-[350px] text-sm pl-3 bg-transparent border-[1px] mt-2 h-[35px] text-white border-[#333B4F] rounded-md focus:outline-none focus:border-[#8096D2]"
                  style={{ zIndex: 50, position: "relative" }}
                />
              </div>
              <div className="flex flex-col">
                <p className="font-light text-sm">Email</p>
                <input
                  className="w-[500px] bp7:w-[350px] text-sm pl-3 bg-transparent border-[1px] mt-2 h-[35px] text-white border-[#333B4F] rounded-md focus:outline-none focus:border-[#8096D2]"
                  style={{ zIndex: 50, position: "relative" }}
                />
              </div>
              <div className="flex flex-col">
                <p className="font-light text-sm">Message</p>
                <input
                  className="w-[500px] bp7:w-[350px] text-sm pl-3 bg-transparent border-[1px] mt-2 h-[100px] text-white border-[#333B4F] rounded-md focus:outline-none focus:border-[#8096D2]"
                  style={{ zIndex: 50, position: "relative" }}
                />
              </div>

              <motion.button
                className="group relative w-[100px] border-[2px] border-[#5B698B] overflow-hidden rounded-full bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] px-2 py-2 text-white backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.2)]"
                onMouseMove={handleMouseMove}
                onHoverStart={() => setIsHovered2(true)}
                onHoverEnd={() => setIsHovered2(false)}
              >
                <span className="relative z-10">Envoyer</span>
                {isHovered2 && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    animate={{
                      background: [
                        `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 50%)`,
                      ],
                    }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="flex w-full pt-32 flex-col bg-gradient-to-b from-[#040508] to-[#0C0F15] bg-transparent justify-center items-center relative">
          <div className="absolute inset-x-0 top-[-120px] z-0 flex justify-center pointer-events-none">
            <div
              className="w-0 h-0
                border-l-[300px] border-l-transparent
                border-r-[300px] border-r-transparent
                border-b-[600px] border-b-[#5B698B]/40
                blur-[100px]
                opacity-50"
            />
            <div
              className="absolute top-[80px]
                w-0 h-0
                border-l-[300px] border-l-transparent
                border-r-[300px] border-r-transparent
                border-b-[600px] border-b-[#5B698B]/50
                blur-[120px]
                opacity-80"
            />
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute left-1/2 top-[20px] -translate-x-1/2 w-[700px] h-[700px] bg-grid-white/[0.2] bg-[length:50px_50px]"
              style={{
                maskImage:
                  "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
                WebkitMaskImage:
                  "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 60%)",
              }}
            />
          </div>
          <motion.h1
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.4 }}
            className="text-8xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <motion.span
              className="text-[#d0d2d8] bp6:text-5xl text-8xl font-light relative flex space-x-1 justify-center"
            >
              {"face10ai.com".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className={`inline-block ${
                    char === "1" || char === "0"
                      ? "font-semibold"
                      : ""
                  }`}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>

          <div className="w-[85%] max-w-5xl flex flex-col mt-16 items-center justify-center relative z-10">
            <p className="text-5xl text-center bp6:text-3xl">
              Prêt à découvrir
            </p>
            <p className="text-5xl text-center bp6:text-3xl mt-2 bg-gradient-to-b from-[#8096D2] to-[#b7b9be] bg-clip-text text-transparent leading-tight">
              votre note d'attractivité ?
            </p>
          </div>

          <div className="flex mt-14 flex-col gap-8 items-center w-full justify-center">
            <motion.button
              className="group relative font-light overflow-hidden border-[2px] border-[#5B698B] rounded-full bg-gradient-to-b from-black to-[rgb(65,64,64)] h-[43px] w-[191px] text-white backdrop-blur-sm transition-colors hover:bg-[rgba(0,0,0,0.30)]"
              onMouseMove={handleMouseMove}
              onHoverStart={() => setIsHovered1(true)}
              onHoverEnd={() => setIsHovered1(false)}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="relative z-10">Commencer</span>
              {isHovered1 && (
                <motion.div
                  className="absolute inset-0 z-0"
                  animate={{
                    background: [
                      `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 50%)`,
                    ],
                  }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </motion.button>

            {!session && (
              <motion.button
                className="group relative border-[2px] font-light border-[#5B698B] overflow-hidden rounded-full bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] h-[43px] w-[191px] text-white backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.2)]"
                onClick={() => router.push('/auth/signup')}
              >
                <span className="relative z-10">Créer un Compte</span>
              </motion.button>
            )}
          </div>

          <div className="border-t-[#333B4F] w-[90%] border-[1px] mt-10 "></div>

          {/* Footer */}
          <footer className="w-full flex flex-row justify-center items-center py-10">
            <div className="flex flex-row w-[90%] justify-evenly bp2:flex-col-reverse bp2:items-center bp2:gap-8">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-[#C5CDE3] bp3:text-5xl text-7xl font-light">
                  face10<span className="font-bold">ai.com</span>
                </h2>
                <div className="flex flex-row gap-3 items-end">
                  <Mail className="w-4 h-4 text-[#8096D2]" />
                  <a
                    href="mailto:contact@face10ai.com"
                    className="font-light text-[#C5CDE3] hover:text-[#8096D2] transition-colors underline text-sm"
                  >
                    contact@face10ai.com
                  </a>
                </div>
                <div className="flex flex-row gap-3 items-end">
                  <MapPin className="w-4 h-4 text-[#8096D2]" />
                  <p className="font-light text-[#C5CDE3] text-sm">
                    Bordeaux, France
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-16 bp3:flex-col bp3:gap-8">
                <div>
                  <h3 className="text-[#C5CDE3] text-2xl font-bold mb-4">
                    Navigation
                  </h3>
                  <nav className="flex flex-col text-gray-400 gap-1 items-center">
                    <a
                      href="/"
                      className="hover:text-[#8096D2] transition-colors"
                    >
                      Accueil
                    </a>
                    <a
                      href="/pricing"
                      className="hover:text-[#8096D2] transition-colors"
                    >
                      Tarifs
                    </a>
                    <a
                      href="/dashboard"
                      className="hover:text-[#8096D2] transition-colors"
                    >
                      Tableau de bord
                    </a>
                    <a
                      href="/about"
                      className="hover:text-[#8096D2] transition-colors"
                    >
                      À propos
                    </a>
                  </nav>
                </div>

                <div>
                  <h3 className="text-[#C5CDE3] text-2xl font-bold mb-4">
                    Légal
                  </h3>
                  <nav className="flex flex-col text-gray-400 gap-1 items-center">
                    <a
                      href="/privacy"
                      className="hover:text-[#8096D2] transition-colors"
                    >
                      Confidentialité
                    </a>
                    <a
                      href="/terms"
                      className="hover:text-[#8096D2] transition-colors"
                    >
                      Conditions
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </footer>
        </div>

        <div className="w-full flex justify-center text-gray-400 text-sm font-light mb-3 items-center">
          <p>Tous droits réservés &copy; 2025 face10ai.com</p>
        </div>
      </div>
    </div>
  )
}
