
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/supabase"; 
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
        if (!credentials?.email || !credentials.password) return null;

        const { data: user, error } = await db
          .from("users")
          // Ambil nama role, bukan hanya id-nya
          .select("*, role:roles(name)") 
          .eq("email", credentials.email as string)
          .single();

        if (error || !user) return null;

        // Cek apakah password cocok
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password_hash || ""
        );

        if (passwordsMatch) {
          // Kirim data user yang relevan ke callback jwt
          return { 
              id: user.id, 
              email: user.email, 
              name: user.name, 
              image: user.image,
              // @ts-ignore
              role: user.role.name // Kirim nama role
            };
        }

        return null;
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