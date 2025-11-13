# Testing Guide for ApplyNHire

## Quick Start Testing

### 1. Start the Development Server
```bash
npm run dev
```
Open http://localhost:3000

---

## Core Feature Tests

### 🏠 Homepage
- [ ] Page loads without errors
- [ ] Search bar is visible and functional
- [ ] Job listings display correctly
- [ ] Jobs are ranked properly (sponsored first, then by engagement)
- [ ] Map section loads (if Google Maps API key is configured)
- [ ] Navigation header works
- [ ] Footer displays correctly

### 🔐 Authentication

#### Applicant Sign Up
1. Click "Sign Up" → "Sign up as Applicant"
2. Fill in:
   - Name: Test Applicant
   - Email: applicant@test.com
   - Password: Test123! (must meet requirements)
3. Submit form
4. ✅ Should redirect to applicant dashboard
5. ✅ Should show welcome message

#### Employer Sign Up
1. Click "Sign Up" → "Sign up as Employer"
2. Fill in:
   - Name: Test Employer
   - Email: employer@test.com
   - Password: Test123!
   - Company Name: Test Company
3. Submit form
4. ✅ Should redirect to employer dashboard

#### Sign In Tests
1. Sign out
2. Click "Sign In"
3. Enter credentials
4. ✅ Should sign in successfully
5. ✅ Session should persist on page refresh

#### OAuth Tests (if configured)
- [ ] Google OAuth works
- [ ] Azure AD OAuth works
- [ ] Yahoo OAuth works
- [ ] User is created/linked properly

---

### 💼 Job Management (Employer)

#### Create Job
1. Sign in as employer
2. Go to Dashboard → "Post a Job"
3. Fill in job details:
   - Title: "Senior Developer"
   - Company: "Test Company"
   - Location: "New York, NY"
   - Type: "Full Time"
   - Description: (at least 50 characters)
   - Salary: $80,000 - $120,000
   - Apply URL or enable applications
4. Submit
5. ✅ Job should be created with "pending" status
6. ✅ Success message should appear

#### View Jobs
1. Go to "My Jobs"
2. ✅ Should see all your posted jobs
3. ✅ Should show status (pending/approved/rejected)
4. ✅ Should show application count

#### Edit Job
1. Click "Edit" on a job
2. Modify details
3. Save
4. ✅ Changes should be saved
5. ✅ Status may reset to "pending"

#### Delete Job
1. Click "Delete" on a job
2. Confirm deletion
3. ✅ Job should be removed

---

### 📝 Applications (Applicant)

#### Apply to Job
1. Sign in as applicant
2. Browse jobs on homepage
3. Click on a job
4. Click "Apply"
5. ✅ Application should be submitted
6. ✅ Cannot apply twice to the same job

#### View Applications
1. Go to Dashboard → "My Applications"
2. ✅ Should see all applications
3. ✅ Should show status (pending/accepted/rejected)
4. ✅ Should show job details

---

### 🔍 Search & Filter

#### Search Tests
1. Enter job title keyword
2. ✅ Results should filter by title
3. Search by location
4. ✅ Results should filter by location
5. Search by company name
6. ✅ Should find jobs by company

#### Filter Tests
- [ ] Filter by job type (Full Time, Part Time, etc.)
- [ ] Filter by minimum salary
- [ ] Filter by category
- [ ] Multiple filters work together
- [ ] Clear filters resets search

---

### 🗺️ Map Features (if Google Maps API configured)

#### Job Map
1. Homepage should show map with job markers
2. Click on a marker
3. ✅ Should show job details popup
4. Click "View Job"
5. ✅ Should navigate to job page

#### Location Picker (Employer)
1. Create job form
2. ✅ Location autocomplete works
3. ✅ Map updates when location selected
4. ✅ Coordinates are saved

---

### ⭐ Engagement Features

#### Like Job
1. View a job (signed in)
2. Click heart icon
3. ✅ Job should be liked
4. ✅ Like count increases
5. Click again to unlike
6. ✅ Like count decreases

#### Save Job
1. View a job
2. Click "Save" button
3. ✅ Job should be saved
4. Go to "Saved Jobs"
5. ✅ Job appears in list

#### Comment on Job
1. View a job
2. Scroll to comments section
3. Write a comment
4. Submit
5. ✅ Comment should appear
6. ✅ Comment count updates

---

### 👑 Admin Panel

#### Admin Login
1. Go to /admin/signin
2. Enter admin credentials
3. ✅ Should sign in to admin panel

#### Approve Jobs
1. Go to "Jobs" tab
2. View pending jobs
3. Click "Approve"
4. ✅ Job status changes to "approved"
5. ✅ Job appears on public site

#### Reject Jobs
1. Click "Reject" on a pending job
2. ✅ Job status changes to "rejected"
3. ✅ Job does not appear publicly

#### User Management
1. Go to "Users" tab
2. ✅ View all users
3. ✅ See user roles
4. ✅ Can view user details

---

### 💳 Sponsored Jobs (Employer)

#### Purchase Ad Balance
1. Sign in as employer
2. Go to Dashboard → "Ad Balance"
3. Purchase balance
4. ✅ Balance updates

#### Sponsor Job
1. Select a job
2. Click "Sponsor"
3. Set parameters:
   - Duration
   - Impression limit
   - Targeting options
4. ✅ Job becomes sponsored
5. ✅ Balance deducts
6. ✅ Job appears at top of listings

---

### 🌟 Reviews & Ratings

#### Leave Review (After Hire)
1. Application status: "hired"
2. Go to application
3. Click "Leave Review"
4. Fill in ratings and comment
5. Submit
6. ✅ Review saved
7. ✅ Average rating updates

#### View Reviews
1. View employer profile
2. ✅ See average rating
3. ✅ See review count
4. ✅ See public reviews

---

### 📧 Email Notifications (if Resend configured)

#### Job Submission
- [ ] Employer receives confirmation
- [ ] Admin receives notification

#### Job Approval/Rejection
- [ ] Employer receives status update

#### Application Received
- [ ] Employer receives notification

#### Application Status Change
- [ ] Applicant receives notification

---

## Performance Tests

### Page Load Times
- [ ] Homepage loads in < 2 seconds
- [ ] Job listings load in < 1 second
- [ ] Search results in < 500ms
- [ ] Dashboard loads in < 1 second

### Database Performance
- [ ] Job queries with indexes < 50ms
- [ ] Search queries < 100ms
- [ ] Complex queries (with relations) < 200ms

---

## Security Tests

### Authentication
- [ ] Cannot access protected routes without login
- [ ] Session expires after timeout
- [ ] Password requirements enforced
- [ ] XSS attempts blocked
- [ ] SQL injection prevented (via Prisma)

### Authorization
- [ ] Applicants cannot access employer routes
- [ ] Employers cannot access applicant routes
- [ ] Non-admins cannot access admin panel
- [ ] Users can only edit their own data

### Rate Limiting
- [ ] Excessive requests are rate limited
- [ ] Rate limits reset properly

---

## Error Handling Tests

### Network Errors
1. Disconnect internet
2. Try to submit a form
3. ✅ Should show error message
4. Reconnect
5. ✅ Should retry successfully

### Validation Errors
1. Submit form with invalid data
2. ✅ Should show validation errors
3. ✅ Fields highlighted
4. ✅ Error messages clear

### 404 Pages
1. Navigate to non-existent URL
2. ✅ Should show 404 page
3. ✅ Navigation still works

---

## Mobile Responsiveness

### Test on Different Sizes
- [ ] Mobile (375px) - iPhone SE
- [ ] Tablet (768px) - iPad
- [ ] Desktop (1920px)

### Mobile Features
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Touch targets adequate
- [ ] Text is readable
- [ ] Images scale properly

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Accessibility

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Esc closes modals

### Screen Reader
- [ ] Images have alt text
- [ ] Form labels present
- [ ] ARIA attributes correct

---

## Data Integrity

### Database Tests
1. Run: `npx prisma studio`
2. Check:
   - [ ] User data saved correctly
   - [ ] Relationships intact
   - [ ] No orphaned records
   - [ ] Indexes present

---

## Common Issues & Solutions

### Issue: Jobs not appearing
**Solution:** Check job status is "approved" in admin panel

### Issue: OAuth not working
**Solution:** 
1. Check environment variables set
2. Verify callback URLs configured
3. Check provider credentials

### Issue: Map not loading
**Solution:** Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to .env.local

### Issue: Emails not sending
**Solution:** Configure Resend API key in .env.local

### Issue: Slow performance
**Solution:**
1. Check database indexes
2. Run: `npx prisma migrate reset`
3. Clear browser cache

---

## Automated Testing Commands

```bash
# Verify system
node scripts/verify-fixes.js

# Check database
npx prisma studio

# Run linter
npm run lint

# Check for security issues
npm audit

# Test build
npm run build
```

---

## Production Deployment Checklist

Before deploying:
- [ ] All tests pass
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Admin user created
- [ ] Security audit passed
- [ ] Performance acceptable
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] SSL certificate active
- [ ] Domain configured

---

## Support

If you find bugs:
1. Check console for errors
2. Check server logs
3. Verify environment configuration
4. Review FIXES_APPLIED.md
5. Create detailed bug report

---

**Happy Testing! 🚀**

For questions or issues, refer to:
- FIXES_APPLIED.md - All fixes documentation
- START_HERE.md - Getting started guide
- DOCUMENTATION_INDEX.md - Complete documentation
