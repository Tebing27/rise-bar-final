// middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const isOnboardingComplete = !!req.auth?.onboarding_complete;

  // Mendefinisikan rute-rute
  const onboardingRoute = '/onboarding';
  const isAdminArea = nextUrl.pathname.startsWith('/admin');
  // Mendefinisikan semua rute yang hanya untuk pengguna biasa
  const isUserSpecificArea = 
    nextUrl.pathname.startsWith('/tracker') || 
    nextUrl.pathname.startsWith('/onboarding') ||
    nextUrl.pathname.startsWith('/reports') ||
    nextUrl.pathname.startsWith('/profile');

  // --- ATURAN AKSES BARU ---

  // Aturan 1: Jika pengguna adalah 'admin', arahkan mereka keluar dari halaman pengguna biasa.
  if (isLoggedIn && userRole === 'admin' && isUserSpecificArea) {
    // Arahkan admin ke dashboard admin utama mereka.
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Aturan 2: Jika pengguna BUKAN 'admin', jangan izinkan mereka masuk ke area admin.
  if (isLoggedIn && userRole !== 'admin' && isAdminArea) {
     return NextResponse.redirect(new URL('/tracker', req.url)); // Arahkan ke dashboard mereka
  }
  
  // Aturan 3: Paksa pengguna baru (bukan admin) untuk menyelesaikan onboarding.
  if (isLoggedIn && userRole !== 'admin' && !isOnboardingComplete && nextUrl.pathname !== onboardingRoute) {
    return NextResponse.redirect(new URL(onboardingRoute, req.url));
  }

  // Aturan 4: Jika pengguna yang sudah onboarding mencoba akses halaman onboarding lagi.
  if (isLoggedIn && isOnboardingComplete && nextUrl.pathname === onboardingRoute) {
    return NextResponse.redirect(new URL('/tracker', req.url));
  }

  // Aturan 5: Jika pengguna belum login, jangan izinkan akses ke halaman yang dilindungi.
  if (!isLoggedIn && (isUserSpecificArea || isAdminArea)) {
      return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika tidak ada aturan yang cocok, izinkan permintaan.
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Jalankan middleware di semua rute kecuali yang spesifik di bawah ini
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
