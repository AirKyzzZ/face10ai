# Pricing System Setup Guide

## 🎉 Implementation Complete!

The pricing system has been successfully implemented with the following features:

### ✅ What's Been Implemented

1. **Database Schema**
   - Added subscription fields to User model (subscriptionTier, subscriptionStatus, stripeCustomerId, etc.)
   - Schema ready for migration

2. **Stripe Integration**
   - Installed Stripe packages (`stripe` and `@stripe/stripe-js`)
   - Created Stripe utility library (`lib/stripe.ts`)
   - Implemented checkout, webhook, and customer portal API routes

3. **Subscription Tiers**
   - **Free**: €0, 5 credits (lifetime, no refresh)
   - **Pro**: €6.99/month (30% off from €9.99), 25 credits/month
   - **Premium**: €13.99/month (30% off from €19.99), 50 credits/month

4. **UI Components**
   - `CountdownTimer`: 24-hour countdown timer with localStorage persistence
   - `PricingCard`: Beautiful pricing cards with animations
   - `PricingSection`: Complete pricing section with discount badge and urgency timer

5. **Pages**
   - Created dedicated `/pricing` page with FAQ and testimonials
   - Added pricing section to homepage (after testimonials)
   - Updated navigation menu with "Tarifs" link

6. **Credit Management**
   - Updated credit system to support monthly subscription refreshes
   - Auto-refresh credits for Pro/Premium users based on reset date

## 🔧 Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook signing secret
STRIPE_PRO_PRICE_ID=price_... # Stripe Price ID for Pro plan
STRIPE_PREMIUM_PRICE_ID=price_... # Stripe Price ID for Premium plan

# App URL (for redirects)
NEXTAUTH_URL=http://localhost:3000 # Change to your production URL
```

### 2. Stripe Dashboard Setup

#### A. Create Products and Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create two products:

**Pro Plan:**
- Name: "Pro Monthly Subscription"
- Description: "25 credits per month with advanced AI analysis"
- Pricing: €6.99/month (recurring)
- Copy the Price ID to `STRIPE_PRO_PRICE_ID`

**Premium Plan:**
- Name: "Premium Monthly Subscription"
- Description: "50 credits per month with ultra-precise AI analysis"
- Pricing: €13.99/month (recurring)
- Copy the Price ID to `STRIPE_PREMIUM_PRICE_ID`

#### B. Create Promotion Code (Optional)

1. Navigate to **Products** → **Coupons**
2. Create a 30% off coupon
3. This allows users to apply the discount shown on the pricing page

#### C. Configure Webhooks

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events to listen to:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Database Migration

Run the Prisma migration to update your database schema:

```bash
npm run db:push
# or
npx prisma db push
```

Then regenerate the Prisma client:

```bash
npm run db:generate
# or
npx prisma generate
```

### 4. Testing

#### Test in Development Mode

1. Use Stripe test mode keys (starts with `sk_test_` and `pk_test_`)
2. Use test cards: `4242 4242 4242 4242` (any future date, any CVC)
3. Test the complete flow:
   - Sign up for an account
   - Navigate to pricing page
   - Subscribe to Pro or Premium
   - Check dashboard for updated credits
   - Test credit usage
   - Access customer portal from dashboard

#### Webhook Testing Locally

Use Stripe CLI to forward webhooks to localhost:

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will give you a webhook signing secret (whsec_...)
# Use this for STRIPE_WEBHOOK_SECRET in development
```

### 5. Production Deployment

1. **Update Environment Variables**
   - Switch to live Stripe keys (starts with `sk_live_` and `pk_live_`)
   - Update `NEXTAUTH_URL` to your production domain
   - Configure production webhook endpoint

2. **Test Thoroughly**
   - Test subscription flow
   - Verify webhook events are received
   - Check credit allocation and refresh
   - Test cancellation flow

3. **Monitor**
   - Watch Stripe Dashboard for events
   - Monitor webhook delivery
   - Check application logs for any errors

## 📋 Features Overview

### Pricing Page Features
- ✅ Three-tier pricing (Free, Pro, Premium)
- ✅ 30% discount badge with urgency messaging
- ✅ 24-hour countdown timer (resets after expiration)
- ✅ Beautiful animations with Framer Motion
- ✅ Social proof (user count, ratings)
- ✅ Trust badges (secure payment, money-back guarantee)
- ✅ Comprehensive FAQ section
- ✅ Customer testimonials
- ✅ Responsive design

### User Experience
- ✅ Current plan highlighted
- ✅ One-click subscription
- ✅ Secure Stripe checkout
- ✅ Customer portal for subscription management
- ✅ Monthly credit auto-refresh
- ✅ Credit usage tracking
- ✅ Transaction history

### Marketing Elements
- ✅ Urgency timer (24-hour countdown)
- ✅ Discount pricing (30% off)
- ✅ "Most Popular" badge on Pro tier
- ✅ Social proof and testimonials
- ✅ Trust indicators
- ✅ Clear feature comparisons

## 🎨 Design

All components match your existing dark theme:
- Colors: `#5B698B` → `#8096D2` gradient
- Backgrounds: `#0C0F15`, `#040508`
- Border effects with animated gradients
- Framer Motion animations
- Responsive breakpoints

## 📝 Next Steps

1. **Set up Stripe account** (if not already done)
2. **Configure environment variables**
3. **Run database migration**
4. **Test subscription flow in development**
5. **Configure production webhooks**
6. **Deploy to production**

## 🆘 Troubleshooting

### Webhook Events Not Received
- Check webhook URL is correct
- Verify webhook secret matches
- Check webhook event selections
- Use Stripe CLI for local testing

### Subscription Not Creating
- Verify Stripe keys are correct
- Check price IDs match
- Review browser console for errors
- Check server logs

### Credits Not Refreshing
- Verify `creditsResetAt` date is set
- Check subscription status is 'active'
- Review credit transaction logs
- Test manual credit refresh

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

## 🔐 Security Notes

- Never commit `.env` file to git
- Use webhook signing to verify events
- Validate all webhook data
- Use HTTPS in production
- Regularly rotate API keys

---

**Need Help?** Check the Stripe Dashboard logs and application server logs for detailed error messages.

