/**
 * Script to add credits to a user account
 * Usage: npx tsx scripts/add-credits.ts <email> <credits>
 * Example: npx tsx scripts/add-credits.ts user@example.com 999999
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCredits() {
  const email = process.argv[2]
  const credits = parseInt(process.argv[3] || '999999')

  if (!email) {
    console.error('❌ Error: Email required')
    console.log('\nUsage: npx tsx scripts/add-credits.ts <email> [credits]')
    console.log('Example: npx tsx scripts/add-credits.ts user@example.com 999999')
    process.exit(1)
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        creditsRemaining: true,
        subscriptionTier: true,
      },
    })

    if (!user) {
      console.error(`❌ User not found: ${email}`)
      process.exit(1)
    }

    console.log('\n📊 Current User:')
    console.log('  Name:', user.name || 'N/A')
    console.log('  Email:', user.email)
    console.log('  Current Credits:', user.creditsRemaining)
    console.log('  Subscription:', user.subscriptionTier)

    // Update credits
    const updated = await prisma.user.update({
      where: { email },
      data: { creditsRemaining: credits },
    })

    // Log transaction
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: credits - user.creditsRemaining,
        type: 'admin',
        description: `Admin credit adjustment - Set to ${credits} credits`,
      },
    })

    console.log('\n✅ Credits Updated!')
    console.log('  New Credits:', updated.creditsRemaining)
    console.log('\n🎉 Done! User now has unlimited credits for testing.\n')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addCredits()

