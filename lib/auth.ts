// lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // Cari admin berdasarkan email
        const { data: adminUser, error } = await supabaseAdmin
          .from("users")
          .select("*, role:roles(name)")
          .eq("email", credentials.email as string)
          .single();

        // Pastikan user ada, adalah admin, dan password cocok
        if (
          error ||
          !adminUser ||
          (adminUser.role as { name: string }).name !== "admin"
        ) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          adminUser.password_hash || ""
        );

        if (passwordsMatch) {
          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: (adminUser.role as { name: string }).name,
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
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
