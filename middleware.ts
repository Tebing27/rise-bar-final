// middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const isOnboardingComplete = !!req.auth?.onboarding_complete;

  // --- Mendefinisikan Rute ---
  const isPublicRoute = 
    nextUrl.pathname.startsWith('/login') || 
    nextUrl.pathname.startsWith('/register') ||
    nextUrl.pathname.startsWith('/forgot-password');
    
  const onboardingRoute = '/onboarding';
  const isAdminArea = nextUrl.pathname.startsWith('/admin');
  const isUserArea = 
    nextUrl.pathname.startsWith('/tracker') || 
    nextUrl.pathname === onboardingRoute ||
    nextUrl.pathname.startsWith('/reports') ||
    nextUrl.pathname.startsWith('/profile');

  // --- Aturan Akses ---

  // Aturan 1: Jika sudah login, jangan biarkan akses halaman login/register.
  if (isLoggedIn && isPublicRoute) {
    const redirectUrl = userRole === 'admin' ? '/admin' : '/tracker';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Aturan 2: Jika belum login, paksa ke halaman login saat akses area terproteksi.
  if (!isLoggedIn && (isUserArea || isAdminArea)) {
      return NextResponse.redirect(new URL('/login', req.url));
  }

  // Aturan 3: Jika admin, jangan biarkan akses halaman khusus user biasa.
  if (isLoggedIn && userRole === 'admin' && isUserArea) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Aturan 4: Jika bukan admin, jangan biarkan akses area admin.
  if (isLoggedIn && userRole !== 'admin' && isAdminArea) {
     return NextResponse.redirect(new URL('/tracker', req.url));
  }
  
  // Aturan 5: Paksa user baru (bukan admin) untuk menyelesaikan onboarding.
  if (isLoggedIn && userRole !== 'admin' && !isOnboardingComplete && nextUrl.pathname !== onboardingRoute) {
    return NextResponse.redirect(new URL(onboardingRoute, req.url));
  }

  // Aturan 6: Jika user yang sudah onboarding mencoba akses halaman onboarding lagi.
  if (isLoggedIn && isOnboardingComplete && nextUrl.pathname === onboardingRoute) {
    return NextResponse.redirect(new URL('/tracker', req.url));
  }

  // Jika tidak ada aturan yang cocok, izinkan permintaan.
  return NextResponse.next();
});

// ✅ OPTIMASI: Middleware hanya berjalan di halaman yang relevan untuk meningkatkan performa.
export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/tracker/:path*',
    '/reports/:path*',
    '/profile/:path*',
    '/onboarding',
    '/admin/:path*',
  ],
};