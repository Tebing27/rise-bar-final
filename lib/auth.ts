// lib/auth.ts
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from "bcryptjs";
import { SignJWT } from 'jose'; // <-- 1. Import from 'jose'

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        if (error || !user || !user.role) return null;

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
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    // V V V V V  THE FINAL FIX IS HERE V V V V V
    async session({ session, token }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
      }

      if (signingSecret && token.sub) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub,
          email: token.email,
          role: "authenticated",
        };
        
        // 2. Sign the token using 'jose'
        const encodedSecret = new TextEncoder().encode(signingSecret);
        session.supabaseAccessToken = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(encodedSecret);
      }
      
      return session;
    },
    // ^ ^ ^ ^ ^ THE FINAL FIX IS HERE ^ ^ ^ ^ ^
  },
  pages: {
    signIn: "/login",
  },
});