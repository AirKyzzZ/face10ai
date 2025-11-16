/**
 * Quick script to give unlimited credits to the first admin user
 * Usage: npm run unlimited-credits
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setUnlimited() {
  try {
    // Get the first user (usually the admin/developer)
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        creditsRemaining: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    if (users.length === 0) {
      console.log('❌ No users found. Create an account first.')
      process.exit(1)
    }

    console.log('\n👥 Available Users:')
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} - ${user.name || 'No name'} (${user.creditsRemaining} credits)`)
    })

    // Give unlimited credits to first user
    const firstUser = users[0]
    const unlimitedCredits = 999999

    await prisma.user.update({
      where: { id: firstUser.id },
      data: { creditsRemaining: unlimitedCredits },
    })

    await prisma.creditTransaction.create({
      data: {
        userId: firstUser.id,
        amount: unlimitedCredits,
        type: 'admin',
        description: 'Unlimited credits for testing',
      },
    })

    console.log('\n✅ Success!')
    console.log(`  User: ${firstUser.email}`)
    console.log(`  Credits: ${unlimitedCredits} (unlimited for testing)`)
    console.log('\n🎉 You can now test without credit limits!\n')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setUnlimited()

