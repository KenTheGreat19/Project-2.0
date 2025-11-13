// prisma/seed.js
// Seeds the database with sample data: employers, applicants, jobs, applications, reviews, and badges

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.application.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.job.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@applynhire.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create employers with different ratings
  const employerPassword = await bcrypt.hash('employer123', 10)
  
  const employer1 = await prisma.user.create({
    data: {
      email: 'tech@innovate.com',
      name: 'Sarah Johnson',
      password: employerPassword,
      role: 'EMPLOYER',
      companyName: 'Innovate Tech Solutions',
      location: 'San Francisco, CA',
      website: 'https://innovatetech.example.com',
      bio: 'Leading tech company specializing in AI and machine learning solutions.',
      averageRating: 4.8,
      totalReviews: 15,
      completedHires: 12,
      responseRate: 95.5,
      isVerified: true,
    },
  })

  const employer2 = await prisma.user.create({
    data: {
      email: 'hr@designco.com',
      name: 'Michael Chen',
      password: employerPassword,
      role: 'EMPLOYER',
      companyName: 'DesignCo Studios',
      location: 'New York, NY',
      website: 'https://designco.example.com',
      bio: 'Creative design agency building beautiful digital experiences.',
      averageRating: 4.5,
      totalReviews: 8,
      completedHires: 7,
      responseRate: 88.0,
      isVerified: true,
    },
  })

  const employer3 = await prisma.user.create({
    data: {
      email: 'jobs@startupxyz.com',
      name: 'Emily Rodriguez',
      password: employerPassword,
      role: 'EMPLOYER',
      companyName: 'StartupXYZ',
      location: 'Austin, TX',
      bio: 'Fast-growing startup disrupting the e-commerce space.',
      averageRating: 3.9,
      totalReviews: 4,
      completedHires: 3,
      responseRate: 72.0,
      isVerified: false,
    },
  })

  const employer4 = await prisma.user.create({
    data: {
      email: 'contact@mediocretech.com',
      name: 'Bob Williams',
      password: employerPassword,
      role: 'EMPLOYER',
      companyName: 'MediocreTech Inc',
      location: 'Remote',
      bio: 'Tech consulting company.',
      averageRating: 3.2,
      totalReviews: 6,
      completedHires: 5,
      responseRate: 55.0,
      isVerified: false,
    },
  })

  console.log('✅ Created 4 employers')

  // Create applicants
  const applicantPassword = await bcrypt.hash('applicant123', 10)
  
  const applicant1 = await prisma.user.create({
    data: {
      email: 'john.dev@email.com',
      name: 'John Anderson',
      password: applicantPassword,
      role: 'APPLICANT',
      location: 'San Francisco, CA',
      bio: 'Full-stack developer with 5 years of experience in React and Node.js',
      averageRating: 4.7,
      totalReviews: 3,
      isVerified: true,
    },
  })

  const applicant2 = await prisma.user.create({
    data: {
      email: 'lisa.designer@email.com',
      name: 'Lisa Park',
      password: applicantPassword,
      role: 'APPLICANT',
      location: 'New York, NY',
      bio: 'Senior UI/UX designer passionate about creating intuitive experiences',
      averageRating: 4.9,
      totalReviews: 2,
      isVerified: true,
    },
  })

  const applicant3 = await prisma.user.create({
    data: {
      email: 'alex.engineer@email.com',
      name: 'Alex Thompson',
      password: applicantPassword,
      role: 'APPLICANT',
      location: 'Austin, TX',
      bio: 'Backend engineer specializing in microservices and cloud architecture',
      averageRating: 4.4,
      totalReviews: 1,
      isVerified: false,
    },
  })

  const applicant4 = await prisma.user.create({
    data: {
      email: 'maria.pm@email.com',
      name: 'Maria Garcia',
      password: applicantPassword,
      role: 'APPLICANT',
      location: 'Remote',
      bio: 'Project manager with experience leading cross-functional teams',
      averageRating: 0,
      totalReviews: 0,
      isVerified: false,
    },
  })

  console.log('✅ Created 4 applicants')

  // Create badges
  const badges = await prisma.badge.createMany({
    data: [
      {
        name: 'Top Employer',
        description: 'Consistently rated 4.5+ stars by employees',
        icon: '⭐',
        type: 'employer',
        minRating: 4.5,
        minReviews: 5,
        requiresVerification: true,
      },
      {
        name: 'Verified Company',
        description: 'Company identity has been verified',
        icon: '✓',
        type: 'employer',
        requiresVerification: true,
      },
      {
        name: 'Highly Rated',
        description: 'Maintains excellent ratings',
        icon: '🏆',
        type: 'employer',
        minRating: 4.0,
        minReviews: 3,
      },
      {
        name: 'Reliable Applicant',
        description: 'Known for professionalism and reliability',
        icon: '💼',
        type: 'applicant',
        minRating: 4.5,
        minReviews: 2,
      },
      {
        name: 'Top Candidate',
        description: 'Exceptional ratings from multiple employers',
        icon: '🌟',
        type: 'applicant',
        minRating: 4.7,
        minReviews: 3,
      },
    ],
  })
  console.log('✅ Created badge types')

  // Create jobs with approved status
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Full Stack Developer',
      company: employer1.companyName,
      location: 'San Francisco, CA',
      type: 'Full-time',
      category: 'Technology',
      description: `We're looking for a Senior Full Stack Developer to join our AI team.

**Responsibilities:**
- Design and develop scalable web applications
- Work with React, Node.js, and PostgreSQL
- Collaborate with product and design teams
- Mentor junior developers

**Requirements:**
- 5+ years of experience with JavaScript/TypeScript
- Strong knowledge of React and Node.js
- Experience with cloud platforms (AWS/GCP)
- Excellent communication skills

**Benefits:**
- Competitive salary ($140k-$180k)
- Health, dental, vision insurance
- 401k matching
- Flexible work hours
- Remote work options`,
      applyUrl: 'https://innovatetech.example.com/careers/senior-fullstack',
      status: 'approved',
      salaryMin: 140000,
      salaryMax: 180000,
      employerId: employer1.id,
    },
  })

  const job2 = await prisma.job.create({
    data: {
      title: 'UI/UX Designer',
      company: employer2.companyName,
      location: 'New York, NY',
      type: 'Full-time',
      category: 'Design',
      description: `Join our creative team as a UI/UX Designer!

**What you'll do:**
- Create beautiful, intuitive user interfaces
- Conduct user research and testing
- Design prototypes and mockups
- Collaborate with developers

**Requirements:**
- 3+ years of UI/UX design experience
- Proficiency in Figma and Adobe Creative Suite
- Strong portfolio demonstrating your work
- Understanding of design systems

**Perks:**
- $90k-$120k salary
- Creative work environment
- Professional development budget
- Health benefits`,
      applyUrl: 'https://designco.example.com/jobs/uiux-designer',
      status: 'approved',
      salaryMin: 90000,
      salaryMax: 120000,
      employerId: employer2.id,
    },
  })

  const job3 = await prisma.job.create({
    data: {
      title: 'Backend Engineer',
      company: employer3.companyName,
      location: 'Austin, TX',
      type: 'Full-time',
      category: 'Technology',
      description: `Build the backbone of our e-commerce platform!

**Role:**
- Develop and maintain microservices
- Optimize database performance
- Implement REST and GraphQL APIs
- Work with Docker and Kubernetes

**Must have:**
- 4+ years backend development experience
- Strong knowledge of Node.js or Python
- Experience with databases (PostgreSQL, MongoDB)
- Cloud platform experience

**Compensation:**
- $110k-$145k
- Stock options
- Health insurance
- Remote flexible`,
      applyUrl: 'https://startupxyz.example.com/careers',
      status: 'approved',
      salaryMin: 110000,
      salaryMax: 145000,
      employerId: employer3.id,
    },
  })

  const job4 = await prisma.job.create({
    data: {
      title: 'Project Manager',
      company: employer1.companyName,
      location: 'Remote',
      type: 'Full-time',
      category: 'Management',
      description: `Lead cross-functional teams on exciting AI projects.

**Responsibilities:**
- Manage project timelines and deliverables
- Coordinate between engineering, design, and product
- Track progress and report to stakeholders
- Facilitate agile ceremonies

**Qualifications:**
- 5+ years project management experience
- PMP or Scrum certification preferred
- Excellent communication skills
- Experience with Jira and Confluence

**Package:**
- $95k-$130k
- Full benefits
- Remote work
- Team offsites`,
      applyUrl: 'https://innovatetech.example.com/careers/pm',
      status: 'approved',
      salaryMin: 95000,
      salaryMax: 130000,
      employerId: employer1.id,
    },
  })

  const job5 = await prisma.job.create({
    data: {
      title: 'Junior Frontend Developer',
      company: employer4.companyName,
      location: 'Remote',
      type: 'Full-time',
      category: 'Technology',
      description: `Entry-level opportunity for aspiring developers.

**Responsibilities:**
- Build responsive web interfaces
- Fix bugs and improve code quality
- Learn from senior developers

**Requirements:**
- 1-2 years experience with HTML, CSS, JavaScript
- Basic knowledge of React
- Willingness to learn

**Salary:**
- $60k-$75k
- Health insurance`,
      applyUrl: 'https://mediocretech.example.com/apply',
      status: 'approved',
      salaryMin: 60000,
      salaryMax: 75000,
      employerId: employer4.id,
    },
  })

  console.log('✅ Created 5 approved job postings')

  // Create applications and hire some applicants
  const app1 = await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: applicant1.id,
      status: 'hired',
      hiredAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      employerReviewed: true,
      applicantReviewed: true,
    },
  })

  const app2 = await prisma.application.create({
    data: {
      jobId: job2.id,
      applicantId: applicant2.id,
      status: 'hired',
      hiredAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      employerReviewed: true,
      applicantReviewed: true,
    },
  })

  const app3 = await prisma.application.create({
    data: {
      jobId: job3.id,
      applicantId: applicant3.id,
      status: 'hired',
      hiredAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // 31 days ago - needs reminder
      employerReviewed: true,
      applicantReviewed: false,
      reviewReminderSent: false,
    },
  })

  const app4 = await prisma.application.create({
    data: {
      jobId: job4.id,
      applicantId: applicant1.id,
      status: 'reviewing',
      employerReviewed: false,
      applicantReviewed: false,
    },
  })

  const app5 = await prisma.application.create({
    data: {
      jobId: job5.id,
      applicantId: applicant4.id,
      status: 'pending',
      employerReviewed: false,
      applicantReviewed: false,
    },
  })

  console.log('✅ Created 5 applications (3 hired, 2 pending)')

  // Create reviews
  // Review 1: Applicant reviews employer (job1)
  await prisma.review.create({
    data: {
      applicationId: app1.id,
      reviewerId: applicant1.id,
      revieweeId: employer1.id,
      reviewType: 'employer_review',
      overallRating: 5,
      communication: 5,
      professionalism: 5,
      fairness: 5,
      workEnvironment: 5,
      paymentTimeliness: 4,
      comment: 'Amazing company to work for! Great culture, fair compensation, and excellent communication throughout the hiring process.',
      isVisible: true,
    },
  })

  // Review 2: Employer reviews applicant (job1)
  await prisma.review.create({
    data: {
      applicationId: app1.id,
      reviewerId: employer1.id,
      revieweeId: applicant1.id,
      reviewType: 'applicant_review',
      overallRating: 5,
      communication: 5,
      professionalism: 5,
      punctuality: 5,
      skills: 4,
      comment: 'John is an exceptional developer. Strong technical skills and excellent team player.',
      isVisible: true,
    },
  })

  // Review 3: Applicant reviews employer (job2)
  await prisma.review.create({
    data: {
      applicationId: app2.id,
      reviewerId: applicant2.id,
      revieweeId: employer2.id,
      reviewType: 'employer_review',
      overallRating: 4,
      communication: 4,
      professionalism: 5,
      fairness: 4,
      workEnvironment: 5,
      paymentTimeliness: 4,
      comment: 'Great design team and creative environment. Communication could be slightly better during onboarding.',
      isVisible: true,
    },
  })

  // Review 4: Employer reviews applicant (job2)
  await prisma.review.create({
    data: {
      applicationId: app2.id,
      reviewerId: employer2.id,
      revieweeId: applicant2.id,
      reviewType: 'applicant_review',
      overallRating: 5,
      communication: 5,
      professionalism: 5,
      punctuality: 5,
      skills: 5,
      comment: 'Lisa is incredibly talented and brought fresh perspectives to our team. Highly recommended!',
      isVisible: true,
    },
  })

  // Review 5: Employer reviews applicant (job3) - visible because employer submitted first
  await prisma.review.create({
    data: {
      applicationId: app3.id,
      reviewerId: employer3.id,
      revieweeId: applicant3.id,
      reviewType: 'applicant_review',
      overallRating: 4,
      communication: 4,
      professionalism: 4,
      punctuality: 5,
      skills: 4,
      comment: 'Solid backend engineer with good problem-solving skills.',
      isVisible: false, // Will become visible after 7 days or when applicant submits review
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  })

  console.log('✅ Created 5 reviews')

  // Award badges based on criteria
  const topEmployerBadge = await prisma.badge.findFirst({
    where: { name: 'Top Employer' },
  })

  const verifiedBadge = await prisma.badge.findFirst({
    where: { name: 'Verified Company' },
  })

  const reliableBadge = await prisma.badge.findFirst({
    where: { name: 'Reliable Applicant' },
  })

  await prisma.userBadge.createMany({
    data: [
      { userId: employer1.id, badgeId: topEmployerBadge.id },
      { userId: employer1.id, badgeId: verifiedBadge.id },
      { userId: employer2.id, badgeId: verifiedBadge.id },
      { userId: applicant1.id, badgeId: reliableBadge.id },
      { userId: applicant2.id, badgeId: reliableBadge.id },
    ],
  })

  console.log('✅ Awarded badges to users')

  // Create some notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: applicant3.id,
        type: 'review_reminder',
        title: 'Please review your recent employer',
        message: 'It has been 30 days since you were hired. Please leave a review for StartupXYZ.',
        link: `/applications/${app3.id}`,
        read: false,
      },
      {
        userId: applicant1.id,
        type: 'badge_earned',
        title: 'Badge Earned: Reliable Applicant',
        message: 'Congratulations! You earned the Reliable Applicant badge.',
        read: false,
      },
    ],
  })

  console.log('✅ Created notifications')

  console.log('\n🎉 Database seeding completed!')
  console.log('\n📊 Summary:')
  console.log('- 1 Admin user')
  console.log('- 4 Employers (with varying ratings)')
  console.log('- 4 Applicants')
  console.log('- 5 Job postings (all approved)')
  console.log('- 5 Applications (3 hired, 2 in review)')
  console.log('- 5 Reviews (4 visible, 1 pending visibility)')
  console.log('- 5 Badge types')
  console.log('- 5 User badges awarded')
  console.log('- 2 Notifications')
  console.log('\n🔑 Login credentials:')
  console.log('Admin: admin@applynhire.com / admin123')
  console.log('Employer 1 (Top Rated): tech@innovate.com / employer123')
  console.log('Employer 2: hr@designco.com / employer123')
  console.log('Applicant 1: john.dev@email.com / applicant123')
  console.log('Applicant 2: lisa.designer@email.com / applicant123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
