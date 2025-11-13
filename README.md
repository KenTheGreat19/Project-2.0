# ApplyNHire - Free Job Portal Platform

A modern, open-source job portal built with **Next.js 14**, **React**, **TypeScript**, **Prisma**, and **Tailwind CSS**. Deploy to production in minutes with zero cost.

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm
- SQLite (local) or PostgreSQL (production)
- Git

### Setup (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ApplyNHire.git
cd ApplyNHire

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Architecture

```
ApplyNHire/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes (REST endpoints)
│   ├── admin/             # Admin dashboard
│   ├── applicant/         # Applicant dashboard
│   ├── auth/              # Authentication pages
│   ├── employer/          # Employer dashboard
│   ├── jobs/              # Job detail pages
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   └── ...
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client singleton
│   └── utils.ts          # Helper utilities
├── prisma/
│   ├── schema.prisma     # Database models
│   └── seed.js           # Seed script
├── scripts/              # Automation scripts
│   ├── sendReviewReminders.js
│   ├── processReviewVisibility.js
│   └── awardBadges.js
└── public/               # Static assets
```

## ✨ Features

### 👔 For Employers
- Free unlimited job posting
- Dedicated dashboard to manage postings
- Job application tracking
- Employer verification system
- Rating & review system

### 👨‍💼 For Applicants
- Advanced job search with filters (title, location, type, salary, experience)
- Application history & tracking
- Direct company applications
- Public profile & reviews
- Badge system (Pro applicant, Reliable, etc.)

### 🔐 Admin Features
- Job moderation (approve/reject)
- User management and verification
- Platform analytics & statistics
- Automated email notifications
- Review visibility control

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Next.js 14 |
| **UI Framework** | Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes |
| **Database** | Prisma ORM, SQLite/PostgreSQL |
| **Auth** | NextAuth.js v4 |
| **Email** | Resend (free tier: 100 emails/day) |
| **Forms** | React Hook Form + Zod |
| **UI Components** | Radix UI, Lucide Icons |
| **Theming** | next-themes (dark mode support) |

## 📋 Database Models

- **User** - Applicants, Employers, Admins with roles
- **Job** - Job postings with salary, requirements, status
- **Application** - User applications to jobs
- **Review** - Ratings for employers/applicants
- **Badge** - Achievement system (earned by users)
- **Notification** - In-app & email notifications
- **VerificationDocument** - Employer verification files
- **PublicComment** - Comments on job postings

## 🔐 Authentication & Authorization

```
Role-Based Access Control:
├── APPLICANT (default)
│   ├── View all jobs
│   ├── Apply to jobs
│   └── Leave reviews
├── EMPLOYER
│   ├── Post jobs
│   ├── View applications
│   └── Manage postings
└── ADMIN
    ├── Moderate all jobs
    ├── Manage users
    └── Platform analytics
```

**Methods**: Email/Password + Google OAuth (via NextAuth.js)

## 📦 Key Dependencies

```json
{
  "next": "14.1.0",
  "react": "18.2.0",
  "typescript": "5.x",
  "@prisma/client": "5.9.1",
  "next-auth": "4.24.5",
  "tailwindcss": "3.3.0",
  "zod": "3.22.4",
  "react-hook-form": "7.49.3",
  "resend": "3.2.0"
}
```

## 🎨 Design System

**Color Palette:**
- Primary: `#0A66C2` (LinkedIn-inspired blue)
- Success: `#10B981` (Green for positive actions)
- Warning: `#F59E0B` (Yellow for pending states)
- Error: `#EF4444` (Red for failures)

**Features:**
- Full dark mode support
- Responsive mobile-first design
- Accessible UI (WCAG 2.1 AA)

## 🚀 Deployment

### Option 1: Vercel (Recommended - Free)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import in Vercel Dashboard
# Visit: https://vercel.com/new

# 3. Add Environment Variables in Vercel Dashboard
# See .env.example for required variables

# 4. Deploy!
```

### Option 2: Self-Hosted (Docker)

```bash
# Build Docker image
docker build -t applynhire .

# Run container
docker run -p 3000:3000 -e DATABASE_URL=... applynhire
```

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/applynhire

# Authentication
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com

# Email
RESEND_API_KEY=<get from resend.com>
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com

# Optional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 🧪 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Sync schema with database
npx prisma studio       # Open Prisma Studio GUI
npx prisma seed         # Seed database with initial data

# Utilities
npm run send-review-reminders      # Email review reminders
npm run process-review-visibility  # Update review visibility
npm run award-badges               # Award user badges
```

## 📊 API Endpoints

```
Authentication:
POST   /api/auth/register           # Register new account
POST   /api/auth/[...nextauth]      # NextAuth endpoints

Jobs:
GET    /api/jobs                    # List all jobs
POST   /api/jobs                    # Create job (employer only)
GET    /api/jobs/[id]              # Get job details
PATCH  /api/jobs/[id]              # Update job
DELETE /api/jobs/[id]              # Delete job

Applications:
GET    /api/applications            # List user applications
POST   /api/applications            # Submit application

Reviews:
GET    /api/reviews                 # Get reviews for user
POST   /api/reviews                 # Submit review

Admin:
GET    /api/admin/jobs              # Moderate jobs
PATCH  /api/admin/jobs/[id]/status  # Approve/reject job
GET    /api/admin/stats             # Platform statistics
```

## 🎯 Performance Optimizations

- ✅ Image optimization (WebP, AVIF formats)
- ✅ Code splitting and lazy loading
- ✅ Server-side rendering (SSR) for SEO
- ✅ Static generation for static pages
- ✅ Incremental Static Regeneration (ISR)
- ✅ Optimized Tailwind CSS with PurgeCSS
- ✅ Production source maps disabled
- ✅ Gzip/Brotli compression

## 🔍 SEO

- ✅ Meta tags via next-seo
- ✅ XML sitemap generation
- ✅ Open Graph tags
- ✅ Twitter Card support
- ✅ JSON-LD structured data

## 🐛 Troubleshooting

**Database connection issues?**
```bash
npx prisma db push --force-reset  # Reset database (dev only)
npx prisma studio                  # Debug with Prisma Studio
```

**Build errors?**
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Documentation**: See `/docs` folder

---

**© 2025 ApplyNHire — Open Source Job Portal — 100% Free Forever**
