// lib/auth.ts
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from "bcryptjs";
import { SignJWT } from 'jose';

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
              // ✅ Perbaikan Tipe: Ubah '(any).name' menjadi 'string'
              role: (user.role as { name: string }).name, 
              onboarding_complete: user.onboarding_complete
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
        token.onboarding_complete = user.onboarding_complete;
      }

      if (token.sub) {
        try {
          const { data } = await supabaseAdmin
            .from('users')
            .select('onboarding_complete')
            .eq('id', token.sub)
            .single();
          
          if (data) {
            token.onboarding_complete = data.onboarding_complete;
          }
        } catch (error) {
            console.error("Error refreshing onboarding status in JWT:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      
      session.onboarding_complete = token.onboarding_complete;

      if (signingSecret && token.sub) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub,
          email: token.email,
          role: "authenticated",
        };
        
        const encodedSecret = new TextEncoder().encode(signingSecret);
        session.supabaseAccessToken = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(encodedSecret);
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});