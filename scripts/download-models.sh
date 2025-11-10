#!/bin/bash

# Script to download face-api.js models

echo "📥 Downloading face-api.js models..."

# Create models directory
mkdir -p public/models

cd public/models

# Download tiny face detector model
echo "Downloading tiny_face_detector models..."
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Download face landmark 68 model
echo "Downloading face_landmark_68 models..."
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

# Download face recognition model
echo "Downloading face_recognition models..."
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1

cd ../..

echo "✅ Models downloaded successfully to public/models/"
echo "You can now run the development server with: npm run dev"

