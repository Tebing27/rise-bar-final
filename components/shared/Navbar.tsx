// components/shared/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link
              href="/"
              className="flex flex-shrink-0 items-center font-bold"
            >
              GlucoseTracker
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === 'loading' && <p>Loading...</p>}

            {status === 'unauthenticated' && (
              <>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Blog
                </Link>
                <Link
                  href="/login"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Login
                </Link>
              </>
            )}

            {status === 'authenticated' && (
              <>
                <span className="text-sm text-gray-700">
                  Hi, {session.user?.name || session.user?.email}
                </span>
                <Link
                  href="/tracker"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Tracker
                </Link>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}