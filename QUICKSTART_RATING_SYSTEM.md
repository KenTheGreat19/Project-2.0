# 🚀 Quick Start Guide - ApplyNHire Rating System

Get your reputation-based job marketplace running in 3 minutes!

## Already Done ✅
Your database is seeded with:
- 5 job postings from employers with different ratings
- Multiple test users (employers & applicants)
- Sample reviews and badges
- Rating data that drives the ranking algorithm

## Your Website is Live! 🎉

Visit: **http://localhost:3000**

The homepage now shows:
- ⭐ Employer ratings on job cards
- ✓ Verified company badges
- 🏆 Jobs ranked by employer reputation (not payment)

## Test The System

### 1. View Jobs Ranked by Rating
- Open http://localhost:3000
- Notice jobs from **Innovate Tech** (4.8⭐) appear at the top
- Jobs from **MediocreTech** (3.2⭐) appear lower
- **This is the ranking algorithm in action!**

### 2. Login as Top-Rated Employer
```
Email: tech@innovate.com
Password: employer123
```
- Go to http://localhost:3000/auth/employer
- View your dashboard at http://localhost:3000/employer/dashboard
- See your 4.8-star rating and badges

### 3. Login as Applicant
```
Email: john.dev@email.com
Password: applicant123
```
- Go to http://localhost:3000/auth/applicant
- View your dashboard
- See your 4.7-star rating and "Reliable Applicant" badge

### 4. Test Review System
The database includes:
- ✅ Completed reviews (visible)
- ⏳ Pending reviews (hidden until both sides submit or 7 days pass)
- 📧 One application that needs a review reminder (31 days old)

### 5. Run Background Jobs

**Send Review Reminders:**
```powershell
npm run send-review-reminders
```
Finds applications 30+ days old and sends email reminders.

**Process Review Visibility:**
```powershell
npm run process-review-visibility
```
Makes reviews visible when both parties submit OR 7 days have passed.

**Award Badges:**
```powershell
npm run award-badges
```
Evaluates users and automatically awards badges based on ratings.

## How The Ranking Works

Jobs are sorted by this formula:

| Factor | Weight | Example |
|--------|--------|---------|
| Employer Rating (0-5 stars) | 40% | 4.8⭐ = 96 points |
| Response Rate (0-100%) | 30% | 95.5% = 28.65 points |
| Completed Hires | 20% | 12 hires = 20 points |
| Verified Badge | Bonus | +10 points |

**Result**: Top employers naturally rank higher, no payment needed!

## API Endpoints Available

### Reviews
- `GET /api/reviews?userId=xxx` - Get user's reviews
- `POST /api/reviews` - Submit a review

### Badges  
- `GET /api/badges` - List all badge types
- `GET /api/badges?userId=xxx` - Get user's badges

### Notifications
- `GET /api/notifications` - Get current user's notifications
- `PATCH /api/notifications` - Mark as read

### Jobs (existing)
- `GET /api/jobs` - Employer's jobs
- `POST /api/jobs` - Create job
- `GET /api/admin/jobs` - Admin view all jobs

## What's Different Now?

### Before:
- Jobs sorted by date only
- No employer reputation
- No review system
- Payment could boost listings

### After:
- ⭐ Jobs ranked by employer ratings
- 🏆 Badges show credibility
- 💬 Two-way review system
- 🔍 Transparent ranking (no paid boosts)
- 📧 Automated reminder emails
- 📊 Rating analytics on dashboards

## Next Steps

1. **Customize the seed data** - Edit `prisma/seed.js` to add your own sample jobs
2. **Set up email** - Add Resend API key to `.env.local` for real emails
3. **Build review UI** - Create frontend components to submit/view reviews
4. **Deploy** - Push to Vercel and set up cron jobs

## Scheduled Jobs for Production

In production, run these scripts periodically:

**Daily (9am):**
```bash
npm run send-review-reminders
npm run process-review-visibility
```

**Weekly (Sunday 2am):**
```bash
npm run award-badges
```

Use Vercel Cron, GitHub Actions, or any task scheduler.

## Verify Everything Works

1. ✅ Homepage shows jobs with star ratings
2. ✅ Top-rated employers appear first
3. ✅ Job cards show verified badges
4. ✅ Login as employer/applicant works
5. ✅ Background scripts run without errors
6. ✅ Database has sample reviews and badges

## Sample Data Summary

| Type | Count | Details |
|------|-------|---------|
| Users | 9 | 1 admin, 4 employers, 4 applicants |
| Jobs | 5 | All approved, various salary ranges |
| Applications | 5 | 3 hired, 2 pending |
| Reviews | 5 | 4 visible, 1 pending |
| Badges | 5 types | Auto-awarded to qualifying users |
| Notifications | 2 | Review reminder + badge earned |

## Troubleshooting

**Jobs not showing ratings?**
- Refresh the page
- Check browser console for errors

**Scripts failing?**
```powershell
npx prisma generate
npm run seed
```

**Need to reset everything?**
```powershell
npx prisma db push --force-reset
npm run seed
```

## Documentation

- **Full Guide**: See `RATING_SYSTEM_README.md`
- **API Details**: Check route files in `app/api/`
- **Database Schema**: View `prisma/schema.prisma`

## Your Reputation-Based Job Board is Ready! 🎉

The foundation is complete:
- ✅ Database with rating/review system
- ✅ Ranking algorithm implemented
- ✅ Background jobs for automation
- ✅ API endpoints ready
- ✅ Sample data to test with

**No API keys needed to see it working!** Everything runs locally with the seeded data.

Next: Build the UI components for submitting and viewing reviews, or deploy to production!

---

Questions? Check `RATING_SYSTEM_README.md` or the code comments.
