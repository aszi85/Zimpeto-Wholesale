'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import { supabase as defaultSupabase } from '../../supabase.js';

// Helper to generate a compliant UUID with 6 random numeric digits and padding
function generateUUID(): string {
  let numStr = '';
  for (let i = 0; i < 6; i++) {
    numStr += Math.floor(Math.random() * 10).toString();
  }
  return `${numStr}00-0000-4000-8000-000000000000`;
}

// Get or create visitor ID in sessionStorage
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('visitor_id');
  if (!id) {
    id = generateUUID();
    sessionStorage.setItem('visitor_id', id);
  }
  return id;
}

// Safely get Supabase client (default or localStorage configuration fallback)
function getSupabaseClient() {
  if (defaultSupabase) return defaultSupabase;

  if (typeof window !== 'undefined') {
    const url = localStorage.getItem('local_supabase_url');
    const key = localStorage.getItem('local_supabase_anon_key');
    if (url && key && !url.includes('PASTE') && !key.includes('PASTE')) {
      try {
        return createClient(url, key);
      } catch (e) {
        console.error('Failed to initialize local Supabase override client:', e);
      }
    }
  }
  return null;
}

// Detect device type based on user agent and screen size
function detectDeviceType(): string {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return 'Mobile';
  }
  if (/Tablet|iPad|PlayBook|Silicon/i.test(ua)) {
    return 'Tablet';
  }
  const width = window.innerWidth;
  if (width < 768) return 'Mobile';
  if (width >= 768 && width < 1024) return 'Tablet';
  return 'Desktop';
}

// Detect browser from user agent
function detectBrowser(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Opr') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Edg') || ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown';
}

export default function VisitorTracker() {
  const initializedRef = useRef<boolean>(false);
  const visitorIdRef = useRef<string>('');

  // 1. Initial Page Load and Visitor Registration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackVisitor = async () => {
      const client = getSupabaseClient();
      if (!client) {
        console.log('Zimpeto Analytics: Supabase client not initialized (placeholders active).');
        return;
      }

      const visitorId = getOrCreateVisitorId();
      visitorIdRef.current = visitorId;

      try {
        // Check if visitor already exists in DB
        const { data: existingVisitor, error: fetchError } = await client
          .from('visitors')
          .select('id')
          .eq('id', visitorId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching visitor:', fetchError);
          return;
        }

        const now = new Date().toISOString();

        if (existingVisitor) {
          // Update existing visitor session_end
          await client
            .from('visitors')
            .update({ session_end: now })
            .eq('id', visitorId);
          
          initializedRef.current = true;
          console.log('Zimpeto Analytics: Returning visitor session updated.', visitorId);
        } else {
          // Geolocation using ipapi.co
          let location = 'Unknown Location';
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
            const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
              const ipData = await res.json();
              if (ipData.city && ipData.country_name) {
                location = `${ipData.city}, ${ipData.country_name}`;
              } else if (ipData.country_name) {
                location = ipData.country_name;
              }
            }
          } catch (e) {
            console.log('Location detection failed/timed out, using fallback.');
          }

          const device = detectDeviceType();
          const browser = detectBrowser(navigator.userAgent);

          // Insert new unique visitor
          const { error: insertError } = await client
            .from('visitors')
            .insert({
              id: visitorId,
              device,
              browser,
              location,
              session_start: now,
              session_end: now,
              created_at: now
            });

          if (insertError) {
            console.error('Error registering new visitor:', insertError);
          } else {
            console.log('Zimpeto Analytics: New unique visitor registered.', visitorId);
          }
          
          initializedRef.current = true;
        }
      } catch (err) {
        console.error('Error during visitor tracking initialization:', err);
      }
    };

    trackVisitor();
  }, []);

  // 2. Session Heartbeat (updates session_end every 10 seconds to log duration)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(async () => {
      const client = getSupabaseClient();
      if (!client || !initializedRef.current || !visitorIdRef.current) return;

      try {
        await client
          .from('visitors')
          .update({ session_end: new Date().toISOString() })
          .eq('id', visitorIdRef.current);
      } catch (e) {
        console.error('Error syncing session heartbeat:', e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
