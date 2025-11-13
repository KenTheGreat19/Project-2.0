# 🚀 Deployment Guide - ApplyNHire (Cleaned & Optimized)

## Quick Deployment Summary

Your ApplyNHire project has been cleaned and optimized. It's ready for production deployment!

**Deployment Time:** ~5 minutes  
**Complexity:** ⭐ Easy  
**Recommended:** Vercel (Free tier available)

---

## 📋 Pre-Deployment Checklist

Before you deploy, verify:

```bash
# 1. All features work locally
npm run dev
# Test: Create account, post job, apply, review system

# 2. Build completes without errors
npm run build
# Expected: ✅ Build successful

# 3. No TypeScript errors
npm run lint
# Expected: ✅ No errors found

# 4. Database is synced
npx prisma db push
# Expected: ✅ Schema is in sync
```

---

## 🔑 Required Environment Variables

**You'll need these for deployment:**

```env
# Database (Required)
DATABASE_URL=postgresql://user:password@host:port/dbname
# OR for SQLite in production:
# DATABASE_URL=file:./prod.db

# Authentication (Required)
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com

# Email Service (Required - Free tier available)
RESEND_API_KEY=<get from: https://resend.com>
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Admin Email (Required)
ADMIN_EMAIL=admin@yourdomain.com

# Google OAuth (Optional - for social login)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Next.js Secret (Auto-generated if not provided)
# NEXTAUTH_SECRET will work without this, but set it for security
```

---

## 🟦 Option 1: Deploy to Vercel (Recommended - Free)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "refactor: cleanup and optimize project"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select project root: `/` (default)

### Step 3: Add Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```
DATABASE_URL           = your_postgres_connection_string
NEXTAUTH_SECRET        = openssl rand -base64 32
NEXTAUTH_URL           = https://yourdomain.com
RESEND_API_KEY         = your_resend_api_key
RESEND_FROM_EMAIL      = noreply@yourdomain.com
ADMIN_EMAIL            = admin@yourdomain.com
GOOGLE_CLIENT_ID       = (optional)
GOOGLE_CLIENT_SECRET   = (optional)
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your new URL

**Cost:** Free with generous limits
**Domain:** Get free .vercel.app domain or connect your own

---

## 🐳 Option 2: Deploy with Docker

### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

EXPOSE 3000

# Start production server
CMD ["npm", "start"]
```

### Step 2: Build Image

```bash
docker build -t applynhire:latest .
```

### Step 3: Run Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your_db_url" \
  -e NEXTAUTH_SECRET="your_secret" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e RESEND_API_KEY="your_api_key" \
  -e RESEND_FROM_EMAIL="noreply@yourdomain.com" \
  -e ADMIN_EMAIL="admin@yourdomain.com" \
  applynhire:latest
```

---

## 🖥️ Option 3: Self-Hosted (VPS/Linux)

### Step 1: Connect to Server

```bash
ssh user@your-server-ip
cd /var/www/applynhire
```

### Step 2: Clone & Setup

```bash
git clone https://github.com/yourusername/ApplyNHire.git
cd ApplyNHire
npm install
npx prisma db push
npm run build
```

### Step 3: Run with PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "applynhire" -- start

# Save PM2 config
pm2 save

# Restart on reboot
pm2 startup
```

### Step 4: Setup Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🗄️ Database Setup

### Option A: Postgres (Recommended)

**Managed (Easy):**
- Vercel Postgres (https://vercel.com/postgres)
- Supabase (https://supabase.com) - Free tier
- Railway (https://railway.app)

**Command:**
```bash
# Get connection string and add to env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### Option B: MySQL/MariaDB

```prisma
// Change in prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Option C: SQLite (Development Only)

```bash
DATABASE_URL="file:./prod.db"
# Note: Not recommended for production
```

---

## 📧 Email Setup (Resend)

Resend provides 100 free emails/day (upgrade as needed).

### Step 1: Create Account

1. Go to https://resend.com
2. Sign up (free)
3. Get API key

### Step 2: Configure

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Step 3: Verify Domain (Optional)

For production emails, verify your domain in Resend dashboard.

---

## 🔒 SSL Certificate

Automatically included with:
- ✅ Vercel (free)
- ✅ Railway (free)
- ✅ Supabase (free)

For self-hosted, use Let's Encrypt:
```bash
certbot certonly --standalone -d yourdomain.com
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

```bash
# 1. Website loads
curl https://yourdomain.com
# Expected: HTML response

# 2. Create account
# Go to: https://yourdomain.com/auth/applicant/signup
# Create test account

# 3. Login
# Verify login works

# 4. Post job (if employer)
# Verify job posting works

# 5. Apply to job (if applicant)
# Verify application works

# 6. Check email
# Verify notification emails arrive

# 7. Admin dashboard
# Login with ADMIN_EMAIL
# Verify moderation works

# 8. Dark mode
# Toggle dark mode on site
# Verify it works
```

---

## 🐛 Troubleshooting Deployment

### Build Fails
```bash
# Check build locally first
npm run build

# If it fails, check:
npm run lint        # TypeScript errors
npm run dev         # Runtime errors
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma db push

# Or check Prisma Studio
npx prisma studio
```

### Email Not Sending
```bash
# Verify RESEND_API_KEY is set
# Check Resend dashboard for errors
# Check spam folder for test emails
```

### 502 Bad Gateway (Vercel)
```bash
# Usually means app crashed
# Check Vercel Function Logs
# Verify environment variables
# Check database connection
```

---

## 📊 Monitoring

### Vercel Analytics (Free)

```bash
# Already enabled, check at:
# Vercel Dashboard → Project → Analytics
```

### Sentry (Optional - Error Tracking)

```bash
npm install @sentry/nextjs

# Then initialize in pages/_app.tsx
```

### Database Monitoring

```bash
# If using Vercel Postgres
# Dashboard → Data → Query Insights
```

---

## 🔄 Updating in Production

When you have updates:

```bash
# 1. Push to GitHub
git push origin main

# 2. Vercel auto-deploys
# (Check Vercel dashboard)

# 3. For database schema changes
npx prisma db push
```

---

## 💰 Cost Estimation

### Free Tier (Most Users)

| Service | Cost | Limit |
|---------|------|-------|
| Vercel Hosting | Free | 100 GB/mo |
| Vercel Postgres | Free* | 256 MB |
| Resend Emails | Free | 100/day |
| Domain (Vercel) | Free | .vercel.app |
| **Total** | **Free** | **Great for MVP** |

*Vercel Postgres requires Postgres database (Supabase free tier recommended)

### Production Tier (Growing Apps)

| Service | Cost/Month | Limit |
|---------|-----------|-------|
| Vercel | $20+ | Unlimited |
| Postgres (Supabase) | $25+ | More storage |
| Resend | Free-$25 | Up to 50k/mo |
| Custom Domain | $12-15/yr | None |
| **Total** | **~$50-60** | **Scalable** |

---

## 🎯 Deployment Checklist

- [ ] All tests pass locally
- [ ] TypeScript compilation: `npm run build` ✅
- [ ] No lint errors: `npm run lint` ✅
- [ ] GitHub repo is up to date
- [ ] Environment variables copied to clipboard
- [ ] Database is accessible and synced
- [ ] Email service (Resend) key is ready
- [ ] Domain is registered (if custom domain)
- [ ] Team reviewed changes

## 🚀 Deploy!

You're ready! Follow one of the deployment options above and your ApplyNHire will be live in minutes.

---

## 📞 Support

**Having issues?**

1. Check the **Troubleshooting** section above
2. Review **CLEANUP_REPORT.md** for code changes
3. Check **README.md** for setup instructions
4. Run `npm run lint` for TypeScript errors
5. Check service dashboards (Vercel, Resend, etc.)

---

## 🎉 Congratulations!

Your ApplyNHire application is now deployed to production!

**Next steps:**
- Monitor application performance
- Collect user feedback
- Plan new features
- Scale as needed

---

**Happy deploying! 🚀**

**© 2025 ApplyNHire - Ready for Production**
