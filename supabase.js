import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shrxdweuypdqzoszrlwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnhkd2V1eXBkcXpvc3pybHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODc0NTQsImV4cCI6MjA5Njc2MzQ1NH0.4kraFDQdgPzVvkcb4CXMujw8ICT0fq6ybnjzOQCKwc4';

// Helper to check if url is valid
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// Instantiates the Supabase client safely
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('PASTE')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
