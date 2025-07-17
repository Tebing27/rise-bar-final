// lib/supabase-admin.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key are required for admin actions.')
}

// Client ini hanya untuk digunakan di Server Actions / API Routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // Nonaktifkan auto-refresh token untuk client server-side
    autoRefreshToken: false,
    persistSession: false
  }
})