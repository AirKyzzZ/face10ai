# face10ai - Face Attractiveness Rating Platform

A modern SaaS application that analyzes facial attractiveness using AI, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **AI-Powered Face Analysis**: Uses face-api.js for client-side face detection and analysis
- **Consistent Results**: Same photo always returns the same rating (SHA-256 hashing)
- **Credit System**: Free tier with 1 anonymous rating, 5 credits for registered users
- **Referral Program**: Earn 10 credits per successful referral
- **Authentication**: Email/password and Google OAuth via NextAuth.js
- **Modern UI**: Responsive design with Framer Motion animations
- **SEO Optimized**: Comprehensive metadata, sitemap, and Open Graph tags
- **GDPR Compliant**: Privacy-first approach, photos never stored
- **French Language**: All UI and content in French

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- Google OAuth credentials (optional, for Google login)

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd face10ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/face10ai?schema=public"

# Supabase (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_with_openssl_rand_base64_32
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
REFERRAL_CREDITS_AMOUNT=10
INITIAL_SIGNUP_CREDITS=5

# AttractiveNet API (optional - for AI beauty scoring)
NEXT_PUBLIC_PYTHON_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_ATTRACTIVENET=true
```

4. **Generate NextAuth secret**

```bash
openssl rand -base64 32
```

5. **Set up the database**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

6. **Download face-api.js models**

Create a `public/models` directory and download the required models from the face-api.js repository:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`

Or use this command:

```bash
mkdir -p public/models
cd public/models
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
cd ../..
```

7. **Install Python dependencies (for AttractiveNet API)**

If you want to use the AttractiveNet model for AI-powered beauty scoring:

**⚠️ IMPORTANT: TensorFlow requires Python 3.8-3.11. Python 3.12+ is NOT supported.**

**If you have Python 3.12+ (like Python 3.14):**
👉 **See [training/WINDOWS_SETUP.md](training/WINDOWS_SETUP.md) for detailed setup instructions.**

**Quick start (if you have Python 3.11):**

**Windows:**
```powershell
cd training
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements-windows.txt
```

**macOS/Linux:**
```bash
cd training
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

See `training/INSTALL_WINDOWS.md` for detailed Windows installation instructions.

**For macOS/Linux:**
```bash
cd training
pip install -r requirements.txt
```

**Note**: If you encounter TensorFlow installation errors, you're likely using Python 3.12+. Install Python 3.11 and use it specifically.

8. **Run the development server**

In one terminal, start the Next.js app:

```bash
npm run dev
```

In another terminal, start the Python API (if using AttractiveNet):

```bash
npm run api:python
```

Or manually:

```bash
cd training
python inference_api.py
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Note**: The AttractiveNet API runs on `http://localhost:8000` by default. Make sure both services are running if you want to use AI-powered scoring. The app will gracefully fall back to geometric analysis if the API is unavailable.

## 🏗️ Project Structure

```
face10ai/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth configuration
│   │   ├── upload/               # Image upload endpoint
│   │   ├── analyze/              # Face analysis endpoint
│   │   ├── credits/              # Credit management
│   │   ├── referral/             # Referral tracking
│   │   └── signup/               # User registration
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # User dashboard
│   ├── result/[id]/              # Result display page
│   ├── about/                    # About page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/                   # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── GenderSelector.tsx
│   ├── ImageUploader.tsx
│   ├── RatingDisplay.tsx
│   ├── CreditBadge.tsx
│   ├── ShareButtons.tsx
│   ├── ReferralSection.tsx
│   └── SessionProvider.tsx
├── lib/                          # Utility functions
│   ├── prisma.ts                 # Prisma client
│   ├── supabase.ts               # Supabase client
│   ├── auth.ts                   # Auth helpers
│   ├── credits.ts                # Credit management
│   ├── referrals.ts              # Referral system
│   ├── image-hash.ts             # Image hashing
│   ├── anonymous-tracking.ts     # Anonymous user tracking
│   └── face-rating.ts            # Face analysis algorithm
├── prisma/
│   └── schema.prisma             # Database schema
├── public/
│   └── models/                   # Face-api.js models
├── types/
│   └── next-auth.d.ts            # NextAuth type extensions
└── middleware.ts                 # Route protection
```

## 🎯 Key Features Implementation

### Face Analysis Algorithm

The face rating algorithm uses face-api.js to:
1. Detect faces in uploaded images
2. Extract 68 facial landmarks
3. Calculate symmetry score (left vs right comparison)
4. Evaluate proportions based on golden ratio
5. Assess feature quality and spacing
6. Generate a deterministic score (1-10)

### Credit System

- **Anonymous users**: 1 free rating
- **New accounts**: 5 credits
- **Referrals**: 10 credits per successful referral
- Credits are tracked per user with full transaction history

### Caching & Consistency

- Images are hashed using SHA-256
- Results are cached in database by hash
- Same image always returns same score (from cache)

## 🔒 Security & Privacy

- Photos are **never stored** on servers
- Analysis happens client-side in browser
- Only analysis results are saved (not images)
- Passwords are hashed with bcrypt
- GDPR compliant
- CSRF protection via NextAuth

## 📱 Responsive Design

All pages are fully responsive with:
- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎨 Animations

Smooth animations using Framer Motion:
- Page transitions
- Component entrance animations
- Hover effects
- Score reveal animations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Migration

Before first deployment:

```bash
npx prisma migrate deploy
```

## 📝 Environment Variables for Production

Make sure to set all environment variables in your production environment:

- `DATABASE_URL`: Your production database connection string
- `NEXTAUTH_URL`: Your production domain (e.g., https://face10ai.com)
- `NEXTAUTH_SECRET`: Generate a new secret for production
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `NEXT_PUBLIC_APP_URL`: Your production URL

## 🧪 Testing

To test the application:

1. **Anonymous user flow**: Upload image without account
2. **Sign up flow**: Create account with referral code
3. **Credit system**: Verify credits awarded/deducted
4. **Referral system**: Test referral link and credit rewards
5. **Consistency**: Upload same image twice, verify same score

## 📈 Analytics (Optional)

Consider adding:
- Google Analytics
- PostHog
- Plausible Analytics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support, email contact@face10ai.com

## 🎉 Acknowledgments

- face-api.js for face detection
- Next.js team for the amazing framework
- Vercel for hosting platform
- All contributors and users

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
