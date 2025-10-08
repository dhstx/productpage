# Supabase Setup Instructions

## Overview

This document provides step-by-step instructions for setting up Supabase backend services for the DHStx product page platform.

## Prerequisites

- Supabase account (free tier is sufficient)
- Access to Supabase dashboard

## Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name:** dhstx-productpage
   - **Database Password:** (generate a strong password)
   - **Region:** Choose closest to your users
4. Click "Create new project"
5. Wait for project to initialize (~2 minutes)

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL:** `https://[your-project-ref].supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. Add these to your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase-schema.sql` from the project root
4. Paste into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `contact_submissions` table - Stores contact form submissions
- `email_captures` table - Stores newsletter email addresses
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for notifications

## Step 4: Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see two new tables:
   - `contact_submissions`
   - `email_captures`

## Step 5: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
4. Redeploy your application

## Step 6: Test Contact Form

1. Visit your deployed site
2. Scroll to the "Get In Touch" section
3. Fill out and submit the contact form
4. Check Supabase **Table Editor** → `contact_submissions` to verify the data was saved

## Database Schema

### contact_submissions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Contact name |
| email | TEXT | Contact email |
| company | TEXT | Organization name (optional) |
| message | TEXT | Contact message |
| created_at | TIMESTAMP | Submission timestamp |
| status | TEXT | Status: new, contacted, resolved |
| notes | TEXT | Admin notes (optional) |

### email_captures

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | Email address (unique) |
| source | TEXT | Source of capture (e.g., 'landing') |
| created_at | TIMESTAMP | Capture timestamp |
| subscribed | BOOLEAN | Subscription status |
| unsubscribed_at | TIMESTAMP | Unsubscribe timestamp |

## Security Features

### Row Level Security (RLS)

- **Anonymous users** can INSERT into both tables (submit forms)
- **Authenticated users** can SELECT, UPDATE (admin access)
- **Public users** cannot read data (privacy protection)

### Data Protection

- All data encrypted at rest by Supabase
- HTTPS enforced for all API calls
- API keys are public-safe (anon key)
- Service role key should never be exposed to client

## Optional: Email Notifications

To receive email notifications when someone submits the contact form:

### Option 1: Supabase Edge Functions

1. Create an edge function to send emails:
   ```bash
   supabase functions new send-contact-email
   ```

2. Implement email sending logic using services like:
   - SendGrid
   - Resend
   - Mailgun

3. Trigger the function from the database trigger

### Option 2: Webhooks

1. Go to **Database** → **Webhooks** in Supabase dashboard
2. Create a new webhook for `contact_submissions` table
3. Configure to POST to your email service endpoint
4. Set trigger to "INSERT" events

### Option 3: Third-Party Integration

Use services like:
- Zapier (connect Supabase to Gmail/Slack)
- Make.com (automation workflows)
- n8n (self-hosted automation)

## Monitoring & Analytics

### View Submission Stats

Query the `contact_stats` view for analytics:

```sql
SELECT * FROM contact_stats;
```

This returns:
- Total submissions
- Last 7 days count
- Last 30 days count
- Submissions by status

### Export Data

To export contact submissions:

1. Go to **Table Editor** → `contact_submissions`
2. Click "Export" button
3. Choose CSV or JSON format

## Maintenance

### Regular Tasks

1. **Weekly:** Review new contact submissions
2. **Monthly:** Export and backup data
3. **Quarterly:** Review and update RLS policies

### Backup Strategy

Supabase automatically backs up your database daily. To create manual backups:

1. Go to **Settings** → **Database**
2. Click "Create backup"
3. Download backup file

## Troubleshooting

### Form submission fails

1. Check browser console for errors
2. Verify `.env` variables are set correctly
3. Ensure Supabase project is not paused
4. Check RLS policies allow anonymous inserts

### Data not appearing in Supabase

1. Verify table schema matches code
2. Check RLS policies
3. Look for errors in Supabase logs (**Logs** → **Postgres Logs**)

### CORS errors

1. Go to **Settings** → **API**
2. Add your domain to allowed origins
3. Redeploy application

## Support

For Supabase-specific issues:
- Documentation: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

For project-specific issues:
- Contact: contact@daleyhousestacks.com
