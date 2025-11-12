'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BorderBeam } from './magicui/border-beam'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export function ImageUploader({ onImageSelect, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    },
    [onImageSelect]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile]
  )

  // Handle paste events
  useEffect(() => {
    if (disabled) return

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        
        // Check if the item is an image
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault()
          const file = item.getAsFile()
          
          if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
              alert('Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP.')
              return
            }
            
            // Validate file size (10MB max)
            const maxSize = 10 * 1024 * 1024
            if (file.size > maxSize) {
              alert('Le fichier est trop volumineux. Maximum 10MB.')
              return
            }
            
            processFile(file)
          }
          break
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [disabled, processFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled,
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative border-[2px] rounded-2xl p-8 text-center transition-all bg-gradient-to-br from-[#2E3139] to-[#1E2536] overflow-hidden ${
          isDragActive
            ? 'border-[#7586B4] bg-[#2E3139]/90'
            : 'border-[#5B698B]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.01]'}`}
      >
        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          className="from-transparent via-blue-500 to-transparent"
        />
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4 relative z-10">
            <div className="relative w-full h-80 rounded-lg overflow-hidden border-2 border-[#5B698B]">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-300 font-light">
              Cliquez ou déposez une autre image pour changer
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              <svg
                className="w-24 h-24 text-[#7586B4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </motion.div>
            <div>
              <p className="text-xl font-light text-white mb-2">
                {isDragActive
                  ? 'Déposez votre photo ici'
                  : 'Glissez votre photo ici'}
              </p>
              <p className="text-sm text-gray-400 font-light">
                ou cliquez pour sélectionner, ou collez (Ctrl+V)
              </p>
            </div>
            <p className="text-xs text-gray-500 font-light">
              JPG, PNG ou WebP (max 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
