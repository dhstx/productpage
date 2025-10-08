-- DHStx Product Page - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  notes TEXT
);

-- Email Captures Table (for newsletter/updates)
CREATE TABLE IF NOT EXISTS email_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscribed BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);
CREATE INDEX IF NOT EXISTS idx_email_captures_created_at ON email_captures(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous inserts (public can submit forms)
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous email captures" ON email_captures
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policies for authenticated reads (admin access)
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated reads on emails" ON email_captures
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for authenticated updates (admin can update status)
CREATE POLICY "Allow authenticated updates" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated updates on emails" ON email_captures
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a view for contact submission stats (optional)
CREATE OR REPLACE VIEW contact_stats AS
SELECT
  COUNT(*) as total_submissions,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as last_7_days,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as last_30_days,
  COUNT(*) FILTER (WHERE status = 'new') as new_submissions,
  COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved
FROM contact_submissions;

-- Grant access to the view
GRANT SELECT ON contact_stats TO authenticated;

-- Create a function to send email notifications (optional - requires Supabase Edge Functions)
-- This is a placeholder - you'll need to implement the actual email sending logic
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- This would trigger an edge function or webhook
  -- For now, it just logs the event
  RAISE NOTICE 'New contact submission from: %', NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new contact submissions
CREATE TRIGGER on_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact();

-- Insert some test data (optional - remove in production)
-- INSERT INTO contact_submissions (name, email, company, message)
-- VALUES ('Test User', 'test@example.com', 'Test Company', 'This is a test message');

COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the product page';
COMMENT ON TABLE email_captures IS 'Stores email addresses for newsletter/updates';
COMMENT ON COLUMN contact_submissions.status IS 'Submission status: new, contacted, or resolved';
COMMENT ON COLUMN email_captures.subscribed IS 'Whether the user is currently subscribed to emails';
