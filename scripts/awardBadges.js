// scripts/awardBadges.js
// Evaluates users against badge criteria and awards badges automatically

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Starting badge award evaluation...')

  // Get all badge types
  const badges = await prisma.badge.findMany()
  
  // Get all users
  const users = await prisma.user.findMany({
    include: {
      badges: {
        include: {
          badge: true,
        },
      },
    },
  })

  let badgesAwarded = 0

  for (const user of users) {
    const userBadgeIds = user.badges.map(ub => ub.badgeId)

    for (const badge of badges) {
      // Skip if user already has this badge
      if (userBadgeIds.includes(badge.id)) {
        continue
      }

      // Check if badge is for the right user type
      if (badge.type !== user.role.toLowerCase() && badge.type !== 'both') {
        continue
      }

      // Evaluate criteria
      let qualifies = true

      if (badge.minRating && user.averageRating < badge.minRating) {
        qualifies = false
      }

      if (badge.minReviews && user.totalReviews < badge.minReviews) {
        qualifies = false
      }

      if (badge.minCompletedHires && user.completedHires < badge.minCompletedHires) {
        qualifies = false
      }

      if (badge.requiresVerification && !user.isVerified) {
        qualifies = false
      }

      // Award badge if qualified
      if (qualifies) {
        await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: badge.id,
          },
        })

        // Create notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'badge_earned',
            title: `Badge Earned: ${badge.name}`,
            message: `Congratulations! You earned the ${badge.name} badge. ${badge.description}`,
            link: `/profile/${user.id}`,
          },
        })

        console.log(`✅ Awarded "${badge.name}" badge to ${user.name}`)
        badgesAwarded++
      }
    }
  }

  console.log(`\n🎉 Badge evaluation complete! Awarded ${badgesAwarded} new badges.`)
}

main()
  .catch((e) => {
    console.error('❌ Badge award script failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
