import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if credentials are set and not placeholder templates
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseAnonKey.includes('your-anon') &&
  !supabaseAnonKey.includes('your-anon-public-key');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fallback UUID generator if window.crypto.randomUUID is not available
export function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'v-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
}

// Retrieve or initialize unique visitor ID from localStorage
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('zimpeto_visitor_id');
  if (!id) {
    id = generateUUID();
    localStorage.setItem('zimpeto_visitor_id', id);
  }
  return id;
}

export interface VisitorData {
  device_type: string;
  browser: string;
  location: string;
  device_spec: Record<string, any>;
  session_time?: number;
  clicks?: any[];
  page_views?: string[];
  email?: string | null;
}

// Initialize or update the visitor information
export async function saveVisitor(visitorId: string, data: VisitorData) {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured. Skipping saveVisitor.', { visitorId, data });
    return null;
  }

  try {
    const { data: result, error } = await supabase
      .from('visitors')
      .upsert({
        visitor_id: visitorId,
        device_type: data.device_type,
        browser: data.browser,
        location: data.location,
        device_spec: data.device_spec,
        session_time: data.session_time ?? 0,
        email: data.email ?? null,
        last_active: new Date().toISOString()
      }, { onConflict: 'visitor_id' })
      .select();

    if (error) throw error;
    return result;
  } catch (err) {
    console.error('Error saving visitor to Supabase:', err);
    return null;
  }
}

// Update email for the current visitor
export async function updateVisitorEmail(email: string) {
  const visitorId = getOrCreateVisitorId();
  if (!visitorId) return null;

  // Save email to localStorage so it persists client-side
  localStorage.setItem('zimpeto_visitor_email', email);

  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured. Skipping updateVisitorEmail.', { visitorId, email });
    return null;
  }

  try {
    const { data: result, error } = await supabase
      .from('visitors')
      .update({ 
        email, 
        last_active: new Date().toISOString() 
      })
      .eq('visitor_id', visitorId)
      .select();

    if (error) throw error;
    return result;
  } catch (err) {
    console.error('Error updating visitor email in Supabase:', err);
    return null;
  }
}

// Log a click event
export async function logVisitorClick(href: string, text: string) {
  const visitorId = getOrCreateVisitorId();
  if (!visitorId) return;

  const clickEvent = {
    href,
    text: text.trim().substring(0, 100),
    timestamp: new Date().toISOString()
  };

  // Retrieve current clicks from localStorage for sync robustness
  let clicks: any[] = [];
  try {
    clicks = JSON.parse(localStorage.getItem('zimpeto_clicks') || '[]');
  } catch {}
  clicks.push(clickEvent);
  localStorage.setItem('zimpeto_clicks', JSON.stringify(clicks));

  if (!isSupabaseConfigured || !supabase) {
    console.log('Visitor click recorded locally:', clickEvent);
    return;
  }

  try {
    // We update the clicks array directly in the DB
    await supabase
      .from('visitors')
      .update({
        clicks,
        last_active: new Date().toISOString()
      })
      .eq('visitor_id', visitorId);
  } catch (err) {
    console.error('Error logging click to Supabase:', err);
  }
}

// Log a page view event
export async function logVisitorPageView(path: string) {
  const visitorId = getOrCreateVisitorId();
  if (!visitorId) return;

  let pageViews: string[] = [];
  try {
    pageViews = JSON.parse(localStorage.getItem('zimpeto_page_views') || '[]');
  } catch {}
  
  // Only push if it's different from the last page to prevent duplicates on refresh
  if (pageViews[pageViews.length - 1] !== path) {
    pageViews.push(path);
    localStorage.setItem('zimpeto_page_views', JSON.stringify(pageViews));
  }

  if (!isSupabaseConfigured || !supabase) {
    console.log('Visitor page view recorded locally:', path);
    return;
  }

  try {
    await supabase
      .from('visitors')
      .update({
        page_views: pageViews,
        last_active: new Date().toISOString()
      })
      .eq('visitor_id', visitorId);
  } catch (err) {
    console.error('Error logging page view to Supabase:', err);
  }
}

// Update session active time (in seconds)
export async function updateSessionTime(seconds: number) {
  const visitorId = getOrCreateVisitorId();
  if (!visitorId) return;

  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  try {
    await supabase
      .from('visitors')
      .update({
        session_time: seconds,
        last_active: new Date().toISOString()
      })
      .eq('visitor_id', visitorId);
  } catch (err) {
    console.error('Error updating session time in Supabase:', err);
  }
}
