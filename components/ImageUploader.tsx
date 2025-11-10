'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export function ImageUploader({ onImageSelect, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onImageSelect(file)
      }
    },
    [onImageSelect]
  )

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
    <div className="w-full max-w-md mx-auto">
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isDragActive
            ? 'border-purple-600 bg-purple-50'
            : 'border-gray-300 bg-white hover:border-purple-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-600">
              Cliquez ou déposez une autre image pour changer
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive
                  ? 'Déposez votre photo ici'
                  : 'Glissez votre photo ici'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ou cliquez pour sélectionner
              </p>
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG ou WebP (max 10MB)
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

