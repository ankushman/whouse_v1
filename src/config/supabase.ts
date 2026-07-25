// ============================================================================
// AutoFlow Logistics - Supabase Client Configuration
// Infrastructure configuration — database client setup
// ============================================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Graceful fallback: if Supabase is not configured, provide a dummy client
// that will error predictably rather than crashing at module evaluation
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null as unknown as ReturnType<typeof createClient>

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = isConfigured
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
    )
  : null as unknown as ReturnType<typeof createClient>

export function isSupabaseConfigured(): boolean {
  return isConfigured
}
