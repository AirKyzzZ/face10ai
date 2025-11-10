# 🚀 Setup Guide - Combien sur 10

Complete step-by-step guide to get your application running.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database or Supabase account
- Google Cloud Console account (for OAuth)

## Step 1: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE combiensur10;
```

3. Update `DATABASE_URL` in `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/combiensur10?schema=public"
```

### Option B: Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string
5. Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?schema=public"
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret
8. Update `.env.local`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Step 3: NextAuth Configuration

1. Generate a secret:
```bash
openssl rand -base64 32
```

2. Update `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Setup Database

Run Prisma migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Step 6: Download Face-API Models

Run the provided script:

```bash
bash scripts/download-models.sh
```

Or manually download from the face-api.js repository to `public/models/`:
- tiny_face_detector models
- face_landmark_68 models  
- face_recognition models

## Step 7: Configure Application Settings

Update `.env.local` with application settings:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
REFERRAL_CREDITS_AMOUNT=10
INITIAL_SIGNUP_CREDITS=5
```

## Step 8: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 9: Test the Application

1. **Test Anonymous Upload**
   - Go to homepage
   - Select gender
   - Upload an image
   - Verify you get a result

2. **Test User Registration**
   - Click "S'inscrire"
   - Create an account
   - Verify you receive 5 credits

3. **Test Face Analysis**
   - Upload a clear face photo
   - Wait for analysis
   - Verify consistent results (same image = same score)

4. **Test Referral System**
   - Go to dashboard
   - Copy referral link
   - Open in incognito/private window
   - Sign up with referral link
   - Verify both users receive credits

## Common Issues & Solutions

### Issue: "Models not loading"
**Solution**: Ensure face-api.js models are in `public/models/` directory

### Issue: "Database connection error"
**Solution**: Check DATABASE_URL is correct and database is running

### Issue: "Google OAuth not working"
**Solution**: Verify redirect URIs are correctly configured in Google Console

### Issue: "NextAuth error"
**Solution**: Ensure NEXTAUTH_SECRET is set and NEXTAUTH_URL matches your domain

### Issue: "Prisma client not generated"
**Solution**: Run `npx prisma generate`

## Production Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Update URLs to production domain:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
5. Add production redirect URI in Google Console
6. Deploy

## Database Migration for Production

```bash
npx prisma migrate deploy
```

## Monitoring & Maintenance

- Monitor database usage
- Check error logs regularly
- Update face-api.js models if needed
- Keep dependencies updated
- Backup database regularly

## Need Help?

- Check README.md for detailed documentation
- Review error logs in browser console
- Check Vercel/deployment logs
- Contact: contact@combiensur10.fr

---

Happy coding! 🎉

