// next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Mendefinisikan ulang tipe Session untuk menambahkan 'role'
   */
  interface Session {
    user: {
      role?: string | null;
    } & DefaultSession['user'];
  }

  /**
   * Mendefinisikan ulang tipe User untuk menambahkan 'role'
   */
  interface User extends DefaultUser {
    role?: string | null;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Mendefinisikan ulang tipe token JWT untuk menambahkan 'role'
   */
  interface JWT {
    role?: string | null;
  }
}