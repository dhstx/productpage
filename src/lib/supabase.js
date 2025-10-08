import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Contact form submission function
export async function submitContactForm(data) {
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
