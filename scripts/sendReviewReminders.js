// scripts/sendReviewReminders.js
// Sends reminder emails to applicants 30 days after hiring if they haven't left a review.
// Requires: environment variables RESEND_API_KEY and RESEND_FROM_EMAIL set in .env.local

const { PrismaClient } = require('@prisma/client')
const { Resend } = require('resend')

const prisma = new PrismaClient()
const resendApiKey = process.env.RESEND_API_KEY
const resendFrom = process.env.RESEND_FROM_EMAIL

async function sendEmail(to, subject, html) {
  if (!resendApiKey || !resendFrom) {
    console.log('Resend not configured - skipping actual send for', to)
    return
  }

  const resend = new Resend(resendApiKey)
  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to,
      subject,
      html,
    })
    return result
  } catch (err) {
    console.error('Failed sending email to', to, err)
    throw err
  }
}

async function main() {
  console.log('Starting sendReviewReminders job...')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Find applications that were hired at least 30 days ago, where applicant hasn't left a review and we haven't sent a reminder
  const applications = await prisma.application.findMany({
    where: {
      status: 'hired',
      hiredAt: { lte: thirtyDaysAgo },
      applicantReviewed: false,
      reviewReminderSent: false,
    },
    include: {
      applicant: true,
      job: true,
      reviews: true,
      applicant: true,
    },
  })

  console.log('Found', applications.length, 'applications needing reminders')

  for (const app of applications) {
    const to = app.applicant.email
    const subject = `Reminder: Please review your recent hire for ${app.job.title}`
    const html = `
      <p>Hi ${app.applicant.name || 'there'},</p>
      <p>It's been 30 days since you were hired for <strong>${app.job.title}</strong>. Your feedback helps keep our community fair and transparent.</p>
      <p>Please take a minute to rate your employer and share how the experience went.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/applications/${app.id}">Leave a review</a></p>
      <p>Thanks — the ApplyNHire team</p>
    `

    try {
      await sendEmail(to, subject, html)

      // create a notification and mark reminder sent
      await prisma.notification.create({
        data: {
          userId: app.applicantId,
          type: 'review_reminder',
          title: 'Please review your recent hire',
          message: `Please leave a review for ${app.job.title}`,
          link: `/applications/${app.id}`,
          emailSent: !!resendApiKey,
        },
      })

      await prisma.application.update({
        where: { id: app.id },
        data: { reviewReminderSent: true },
      })

      console.log('Reminder sent for application', app.id, 'to', to)
    } catch (err) {
      console.error('Error sending reminder for application', app.id, err)
    }
  }

  console.log('sendReviewReminders job finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
