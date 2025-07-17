// components/auth/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}