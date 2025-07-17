// middleware.ts

import { auth } from '@/lib/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Definisikan path-path penting
  const isAdminLoginRoute = nextUrl.pathname === '/admin/login';
  const isAdminArea = nextUrl.pathname.startsWith('/admin');
  const isTrackerArea = nextUrl.pathname.startsWith('/tracker');

  // Aturan 1: Jika belum login dan mencoba akses area admin (yang BUKAN halaman loginnya)
  if (!isLoggedIn && isAdminArea && !isAdminLoginRoute) {
    // Arahkan ke halaman login admin
    return Response.redirect(new URL('/admin/login', req.url));
  }

  // Aturan 2: Jika belum login dan mencoba akses tracker
  if (!isLoggedIn && isTrackerArea) {
    // Arahkan ke halaman login user
    return Response.redirect(new URL('/login', req.url));
  }

  // Aturan 3: Jika sudah login sebagai BUKAN admin, tapi mencoba akses area admin
  if (isLoggedIn && isAdminArea && !isAdminLoginRoute && userRole !== 'admin') {
    // Lempar ke halaman utama
    return Response.redirect(new URL('/', req.url));
  }

  // Jika semua aturan di atas tidak terpenuhi, izinkan akses.
  return;
});

// Konfigurasi matcher ini sudah benar, tidak perlu diubah.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};