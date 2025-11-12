# ApplyNHire - Reputation-Based Job Marketplace 🌟

A modern, transparent job platform where visibility is earned through ratings — not payment. Built with Next.js 14, Prisma, and SQLite.

## 🎯 Core Features

### Two-Way Rating System
- **Employer Ratings**: Applicants rate employers 30 days after hiring on fairness, communication, payment timeliness, and work environment
- **Applicant Ratings**: Employers rate applicants immediately after interviews/hiring on communication, punctuality, skills, and professionalism
- **Automated Reminders**: Email notifications sent 30 days post-hire to request reviews
- **Visibility Rules**: Reviews become visible when both parties submit OR after 7 days

### Ranking Algorithm
Jobs are ranked by:
- **Employer Rating** (40% weight): Average star rating from past hires
- **Response Rate** (30% weight): How quickly employers respond to applications
- **Completed Hires** (20% weight): Number of successful placements
- **Verification Badge** (+10 bonus): Verified company status

Higher-rated employers automatically appear at the top of job listings.

### Badge System
Automated badges awarded based on performance:

**Employer Badges:**
- 🏆 **Top Employer**: 4.5+ stars, 5+ reviews, verified
- ✓ **Verified Company**: Identity verified
- ⭐ **Highly Rated**: 4.0+ stars, 3+ reviews

**Applicant Badges:**
- 💼 **Reliable Applicant**: 4.5+ stars, 2+ reviews
- 🌟 **Top Candidate**: 4.7+ stars, 3+ reviews

### User Dashboards
- **Employers**: Post jobs, track applications, manage reviews, view analytics
- **Applicants**: Browse jobs, apply, track applications, view ratings
- **Admin**: Approve jobs, moderate content, manage users

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```powershell
git clone https://github.com/KenTheGreat19/ApplyNHire.git
cd ApplyNHire
```

2. **Install dependencies**
```powershell
npm install
```

3. **Set up environment variables**
Copy `.env.local` (already created) and configure:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
ADMIN_EMAIL="admin@applynhire.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional - for email functionality
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

4. **Initialize database and seed with sample data**
```powershell
npm run seed
```

This creates:
- 1 Admin user
- 4 Employers (with varying ratings)
- 4 Applicants
- 5 Approved job postings
- Sample applications, reviews, and badges

5. **Start development server**
```powershell
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Login Credentials

### Admin
- **Email**: admin@applynhire.com
- **Password**: admin123

### Employers
- **Top Rated (4.8⭐)**: tech@innovate.com / employer123
- **Good Rating (4.5⭐)**: hr@designco.com / employer123
- **Average (3.9⭐)**: jobs@startupxyz.com / employer123
- **Poor (3.2⭐)**: contact@mediocretech.com / employer123

### Applicants
- **Top Candidate**: john.dev@email.com / applicant123
- **Highly Rated**: lisa.designer@email.com / applicant123
- **New User**: alex.engineer@email.com / applicant123
- **No Reviews**: maria.pm@email.com / applicant123

## 📋 Available Scripts

### Development
```powershell
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```powershell
npm run seed         # Seed database with sample data
npx prisma studio    # Open Prisma Studio to view/edit data
npx prisma generate  # Regenerate Prisma Client
npx prisma db push   # Push schema changes to database
```

### Background Jobs (Scheduled Tasks)
```powershell
npm run send-review-reminders      # Send 30-day review reminder emails
npm run process-review-visibility  # Make reviews visible per 7-day rule
npm run award-badges              # Evaluate and award badges automatically
```

### Recommended Scheduling
These scripts should run periodically in production:

| Script | Frequency | Purpose |
|--------|-----------|---------|
| `send-review-reminders` | Daily | Email applicants 30 days after hire |
| `process-review-visibility` | Daily | Make pending reviews visible |
| `award-badges` | Weekly | Award badges to qualifying users |

## 📧 Email Configuration

### Using Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

### Alternative Email Services
The email sending logic in `scripts/sendReviewReminders.js` can be adapted for:
- SendGrid
- Mailgun
- AWS SES
- SMTP

## 🏗️ Project Structure

```
ApplyNHire/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── reviews/       # Review endpoints
│   │   ├── badges/        # Badge endpoints
│   │   ├── notifications/ # Notification endpoints
│   │   └── jobs/          # Job CRUD
│   ├── admin/            # Admin dashboard
│   ├── applicant/        # Applicant dashboard
│   ├── employer/         # Employer dashboard
│   └── jobs/[id]/        # Job detail pages
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── JobCard.tsx      # Job listing card (with ratings)
│   ├── JobList.tsx      # Job list (with ranking)
│   └── Header.tsx       # Navigation
├── lib/                 # Utilities
│   ├── auth.ts         # NextAuth configuration
│   ├── prisma.ts       # Prisma client
│   └── utils.ts        # Helper functions
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.js         # Seed script
├── scripts/            # Background jobs
│   ├── sendReviewReminders.js
│   ├── processReviewVisibility.js
│   └── awardBadges.js
└── public/            # Static assets
```

## 🗄️ Database Schema

### Key Models
- **User**: Employers, applicants, and admins with rating fields
- **Job**: Job postings with employer relationships
- **Application**: Links jobs and applicants with hire status
- **Review**: Two-way reviews with visibility control
- **Badge**: Badge types with criteria
- **UserBadge**: Awarded badges
- **Notification**: In-app and email notifications

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Email**: Resend (optional)
- **Deployment**: Vercel-ready

## 🔐 Security Features

- Secure password hashing (bcrypt)
- Session-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection protection (Prisma)

## 📈 Ranking Algorithm Details

Jobs are sorted using this formula:

```javascript
ratingScore = (averageRating / 5) * 100    // 0-100
responseScore = responseRate               // 0-100
hireScore = min(completedHires * 5, 100)   // 0-100
verifiedBonus = isVerified ? 10 : 0        // 0 or 10

totalScore = (ratingScore * 0.4) + 
             (responseScore * 0.3) + 
             (hireScore * 0.2) + 
             verifiedBonus
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

### Database in Production
For production, upgrade from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Get a PostgreSQL database (Vercel Postgres, Neon, Supabase)
3. Update `DATABASE_URL` in production environment
4. Run migrations: `npx prisma migrate deploy`

### Scheduled Jobs in Production
Use one of:
- **Vercel Cron Jobs** (cron tab in vercel.json)
- **GitHub Actions** (scheduled workflows)
- **Render Cron Jobs**
- **AWS EventBridge**
- **Heroku Scheduler**

Example `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/review-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/review-visibility",
      "schedule": "0 10 * * *"
    },
    {
      "path": "/api/cron/award-badges",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🐛 Troubleshooting

### Database Issues
```powershell
# Reset database and reseed
npx prisma db push --force-reset
npm run seed
```

### TypeScript Errors
```powershell
# Regenerate Prisma client
npx prisma generate
```

### Port Already in Use
```powershell
# Change port in package.json
"dev": "next dev -p 3001"
```

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/KenTheGreat19/ApplyNHire/issues)
- Documentation: Check this README

## 🎉 Features Implemented

✅ Two-way rating system  
✅ 30-day review reminders  
✅ Automatic review visibility (7-day rule)  
✅ Reputation-based job ranking  
✅ Badge system with auto-awards  
✅ Separate dashboards for all user types  
✅ Email notifications (Resend integration)  
✅ Database seeding for testing  
✅ Responsive modern UI  
✅ Dark mode support  
✅ Authentication & authorization  

## 🚀 What's Next

Potential enhancements:
- [ ] Advanced search filters (skills, experience level)
- [ ] In-app messaging between employers/applicants
- [ ] Resume upload and parser
- [ ] Company profiles with photos/videos
- [ ] Application tracking analytics
- [ ] Email templates for better notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration for optional boosts (for 4.0+ rated employers only)

---

**Built with ❤️ for fair and transparent hiring**
