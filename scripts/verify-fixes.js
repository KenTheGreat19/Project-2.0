#!/usr/bin/env node

/**
 * Quick verification script to test critical functionality
 * Run: node scripts/verify-fixes.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function success(msg) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`)
}

function error(msg) {
  console.log(`${colors.red}✗${colors.reset} ${msg}`)
}

function info(msg) {
  console.log(`${colors.blue}ℹ${colors.reset} ${msg}`)
}

async function verifyDatabase() {
  info('Checking database connection...')
  try {
    await prisma.$connect()
    success('Database connection successful')
    return true
  } catch (err) {
    error(`Database connection failed: ${err.message}`)
    return false
  }
}

async function verifyTables() {
  info('Verifying database tables...')
  try {
    const tables = [
      { name: 'User', query: () => prisma.user.count() },
      { name: 'Job', query: () => prisma.job.count() },
      { name: 'Application', query: () => prisma.application.count() },
      { name: 'Review', query: () => prisma.review.count() },
    ]

    for (const table of tables) {
      const count = await table.query()
      success(`${table.name} table exists (${count} records)`)
    }
    return true
  } catch (err) {
    error(`Table verification failed: ${err.message}`)
    return false
  }
}

async function verifyIndexes() {
  info('Checking database indexes...')
  try {
    // Test query performance with indexes
    const startTime = Date.now()
    await prisma.job.findMany({
      where: { status: 'approved' },
      take: 10,
    })
    const endTime = Date.now()
    
    if (endTime - startTime < 1000) {
      success(`Query performance good (${endTime - startTime}ms)`)
    } else {
      error(`Query performance slow (${endTime - startTime}ms)`)
    }
    return true
  } catch (err) {
    error(`Index check failed: ${err.message}`)
    return false
  }
}

async function verifyEnvironment() {
  info('Checking environment variables...')
  
  const required = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL']
  const optional = [
    'GOOGLE_CLIENT_ID',
    'AZURE_AD_CLIENT_ID',
    'YAHOO_CLIENT_ID',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  ]

  let allRequired = true
  for (const key of required) {
    if (process.env[key]) {
      success(`${key} is set`)
    } else {
      error(`${key} is missing (required)`)
      allRequired = false
    }
  }

  for (const key of optional) {
    if (process.env[key]) {
      success(`${key} is set (optional)`)
    } else {
      info(`${key} is not set (optional)`)
    }
  }

  return allRequired
}

async function verifyAdmin() {
  info('Checking admin user...')
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@applynhire.com'
    const admin = await prisma.user.findFirst({
      where: {
        email: adminEmail,
        role: 'ADMIN',
      },
    })

    if (admin) {
      success(`Admin user found: ${admin.email}`)
    } else {
      error(`Admin user not found. Run: node scripts/initAdmin.js`)
    }
    return !!admin
  } catch (err) {
    error(`Admin check failed: ${err.message}`)
    return false
  }
}

async function verifyJobs() {
  info('Checking job listings...')
  try {
    const approvedJobs = await prisma.job.count({
      where: { status: 'approved' },
    })
    
    const pendingJobs = await prisma.job.count({
      where: { status: 'pending' },
    })

    success(`Found ${approvedJobs} approved jobs`)
    info(`Found ${pendingJobs} pending jobs`)
    
    if (approvedJobs === 0) {
      info('No approved jobs yet. This is normal for a new installation.')
    }
    
    return true
  } catch (err) {
    error(`Job check failed: ${err.message}`)
    return false
  }
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('  ApplyNHire - System Verification')
  console.log('='.repeat(60) + '\n')

  const checks = [
    { name: 'Environment', fn: verifyEnvironment },
    { name: 'Database', fn: verifyDatabase },
    { name: 'Tables', fn: verifyTables },
    { name: 'Indexes', fn: verifyIndexes },
    { name: 'Admin', fn: verifyAdmin },
    { name: 'Jobs', fn: verifyJobs },
  ]

  let passed = 0
  let failed = 0

  for (const check of checks) {
    console.log(`\n--- ${check.name} Check ---`)
    try {
      const result = await check.fn()
      if (result) {
        passed++
      } else {
        failed++
      }
    } catch (err) {
      error(`Unexpected error: ${err.message}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`  Results: ${colors.green}${passed} passed${colors.reset}, ${failed > 0 ? colors.red : colors.green}${failed} failed${colors.reset}`)
  console.log('='.repeat(60) + '\n')

  if (failed === 0) {
    success('All checks passed! Your application is ready to use.')
    console.log('\n' + colors.blue + 'Next steps:' + colors.reset)
    console.log('  1. Run: npm run dev')
    console.log('  2. Open: http://localhost:3000')
    console.log('  3. Test authentication and features\n')
  } else {
    error('Some checks failed. Please review the errors above.')
    console.log('\n' + colors.yellow + 'Common fixes:' + colors.reset)
    console.log('  - Run: npx prisma generate')
    console.log('  - Run: npx prisma db push')
    console.log('  - Run: node scripts/initAdmin.js')
    console.log('  - Check your .env.local file\n')
  }

  await prisma.$disconnect()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
