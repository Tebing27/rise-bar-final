// lib/auth.ts
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from '@/lib/supabase-admin'; // Gunakan admin client
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // PERBAIKAN 1: Tambahkan session strategy secara eksplisit
  session: { strategy: "jwt" },
  
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*, role:roles(name)")
          .eq("email", credentials.email as string)
          .single();

        if (error || !user) return null;

        if (!user.role) return null; 

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password_hash || ""
        );

        if (passwordsMatch) {
          return { 
              id: user.id, 
              email: user.email, 
              name: user.name, 
              image: user.image,
              role: user.role.name
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // PERBAIKAN 2: Pastikan callback jwt dan session sudah benar
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Gunakan 'sub' untuk user id
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});