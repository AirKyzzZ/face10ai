# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies (30 seconds)

```bash
npm install
```

## 2. Create Environment File (1 minute)

Create `.env.local` in the root directory:

```env
# Minimum required for local testing
DATABASE_URL="postgresql://postgres:password@localhost:5432/combiensur10?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
REFERRAL_CREDITS_AMOUNT=10
INITIAL_SIGNUP_CREDITS=5

# Optional: Add later for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: Add if using Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Download Face Models (1 minute)

```bash
bash scripts/download-models.sh
```

Or manually:
```bash
mkdir -p public/models
cd public/models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
cd ../..
```

## 4. Setup Database (2 minutes)

**Option A: Local PostgreSQL**
```bash
# Make sure PostgreSQL is running
createdb combiensur10

# Run migrations
npx prisma migrate dev --name init
npx prisma generate
```

**Option B: Supabase (Easier)**
1. Create free account at supabase.com
2. Create new project
3. Copy DATABASE_URL from project settings
4. Update .env.local
5. Run:
```bash
npx prisma db push
npx prisma generate
```

## 5. Start Development Server (10 seconds)

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🧪 Quick Test

1. **Homepage**: Select gender → Upload photo → Click "Analyser"
2. **Sign Up**: Create account → Get 5 credits
3. **Dashboard**: View credits → Copy referral link
4. **Consistency**: Upload same photo twice → Verify same score

---

## ⚠️ Troubleshooting

### "Models not loading"
- Check `public/models/` has 6 files
- Re-run `bash scripts/download-models.sh`

### "Database error"
- Verify PostgreSQL is running
- Check DATABASE_URL in .env.local
- Try: `npx prisma db push`

### "Face not detected"
- Use clear, well-lit face photo
- Ensure face is visible and centered
- Try different photo

---

## 📚 Full Documentation

- **Setup Guide**: See `SETUP_GUIDE.md`
- **Project Details**: See `README.md`
- **Summary**: See `PROJECT_SUMMARY.md`

---

**That's it! You're ready to develop! 🚀**

