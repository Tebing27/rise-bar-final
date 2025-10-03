// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAdminArea = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/forgot-password");

  // Jika sudah login dan mencoba akses halaman login, redirect ke admin dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Jika belum login dan mencoba akses area admin, redirect ke halaman login admin
  if (
    !isLoggedIn &&
    isAdminArea &&
    !nextUrl.pathname.startsWith("/admin/login")
  ) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Jika sudah login tapi bukan admin dan mencoba akses area admin
  if (isLoggedIn && userRole !== "admin" && isAdminArea) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect ke homepage
  }

  // Izinkan permintaan lainnya
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/login", "/forgot-password"],
};
