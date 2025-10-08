import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'placeholder-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key';

// Create Supabase client (will work with placeholder values but won't make real API calls)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Contact form submission function
export async function submitContactForm(data) {
  // If Supabase is not configured, log to console and return success (for demo purposes)
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured. Contact form data:', data);
    console.warn('To enable contact form submissions, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
    return { 
      success: true, 
      data: { message: 'Demo mode: Contact form would be submitted to Supabase when configured.' } 
    };
  }

  try {
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: data.name,
          email: data.email,
          company: data.company || null,
          message: data.message,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
}

// Email capture function (for newsletter/updates)
export async function captureEmail(email, source = 'landing') {
  // If Supabase is not configured, log to console and return success (for demo purposes)
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured. Email capture:', { email, source });
    console.warn('To enable email capture, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
    return { 
      success: true, 
      data: { message: 'Demo mode: Email would be captured to Supabase when configured.' } 
    };
  }

  try {
    const { data: result, error } = await supabase
      .from('email_captures')
      .insert([
        {
          email: email,
          source: source,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error('Error capturing email:', error);
    return { success: false, error: error.message };
  }
}
