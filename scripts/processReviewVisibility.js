// scripts/processReviewVisibility.js
// Makes reviews visible when both sides have submitted OR 7 days have passed since first review

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Starting processReviewVisibility job...')

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // 1) Make reviews visible where both employerReviewed and applicantReviewed are true
  const appsBoth = await prisma.application.findMany({
    where: {
      employerReviewed: true,
      applicantReviewed: true,
    },
    include: { reviews: true },
  })

  for (const app of appsBoth) {
    await prisma.review.updateMany({
      where: { applicationId: app.id, isVisible: false },
      data: { isVisible: true },
    })
    console.log('Made reviews visible for application', app.id)
  }

  // 2) Make reviews visible if the first review is older than 7 days (one side submitted and the other didn't)
  const reviewsToUnblock = await prisma.review.findMany({
    where: {
      isVisible: false,
      createdAt: { lte: sevenDaysAgo },
    },
    include: { application: true },
  })

  for (const r of reviewsToUnblock) {
    // If the related application has at least one review older than 7 days, unhide all reviews for that application
    await prisma.review.updateMany({
      where: { applicationId: r.applicationId, isVisible: false },
      data: { isVisible: true },
    })
    console.log('Unhid reviews for application', r.applicationId)
  }

  console.log('processReviewVisibility job finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
