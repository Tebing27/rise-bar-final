
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Credentials from "next-auth/providers/credentials";
// Pastikan baris ini mengimpor supabaseAdmin, BUKAN db dari lib/supabase
import { supabaseAdmin as db } from '@/lib/supabase-admin'; 
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: SupabaseAdapter({
         url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
     }),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("\n--- PROSES OTORISASI DIMULAI ---");

        if (!credentials?.email || !credentials.password) {
          console.log("[GAGAL] Email atau password tidak dikirim.");
          return null;
        }

        console.log(`[INFO] Mencoba login dengan email: ${credentials.email}`);

        try {
          // Gunakan client admin untuk membaca tabel user
          const { data: user, error: userError } = await db
            .from('users')
            .select('*, role:roles(name)')
            .eq('email', credentials.email as string)
            .single();

          if (userError) {
            console.error('[ERROR DB] Gagal mengambil data user:', userError.message);
            return null;
          }

          if (!user) {
            console.log('[GAGAL] Pengguna dengan email tersebut tidak ditemukan di database.');
            return null;
          }

          console.log('[OK] Pengguna ditemukan:', { id: user.id, email: user.email });

          if (!user.password_hash) {
            console.log('[GAGAL] Pengguna ini tidak memiliki hash password di database.');
            return null;
          }

          console.log('[INFO] Membandingkan password...');
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          if (passwordsMatch) {
            console.log('✅ [BERHASIL] Password cocok! Login seharusnya berhasil.');
            // @ts-ignore
            return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role.name };
          } else {
            console.log('[GAGAL] Password tidak cocok.');
            return null;
          }

        } catch (e) {
          console.error("--- KESALAHAN KRITIS DI FUNGSI AUTHORIZE ---", e);
          return null;
        }
      },
    }),
],
  callbacks: {
    // Callback ini digunakan untuk memasukkan 'role' ke dalam token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // Callback ini digunakan untuk memasukkan 'role' dari token ke dalam object `session`
    // agar bisa diakses di sisi client (misal: `session.user.role`)
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Arahkan ke halaman login kustom kita
  },
});