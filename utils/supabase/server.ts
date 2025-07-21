import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth' // <-- 1. Impor auth dari NextAuth

export async function createClient() {
  const cookieStore = await cookies()
  const session = await auth() // <-- 2. Dapatkan sesi NextAuth

  // Opsi untuk Supabase client
  const supabaseOptions = {
    auth: {
      // Nonaktifkan pengelolaan sesi otomatis oleh Supabase
      // karena kita akan menanganinya secara manual dengan NextAuth
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    // Opsi global untuk menyertakan JWT dari NextAuth di setiap request
    global: {
      headers: {
        // Jika ada token akses dari adapter Supabase di NextAuth, gunakan itu
        // Ini adalah kunci utama agar RLS berfungsi
        Authorization: `Bearer ${session?.supabaseAccessToken ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    },
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...supabaseOptions, // <-- 3. Gunakan opsi yang sudah kita definisikan
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
