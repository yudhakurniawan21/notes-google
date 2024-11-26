import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  // Aturan akses dinamis
  const routes = [
    {
      path: "/dashboard",
      requiresAuth: true, // Halaman memerlukan autentikasi
      redirectIfUnauthenticated: "/login", // Redirect jika tidak login
    },
    {
      path: "/login",
      requiresAuth: false, // Halaman tidak memerlukan autentikasi
      redirectIfAuthenticated: "/", // Redirect jika sudah login
    },
    {
      path: "/signup",
      requiresAuth: false,
      redirectIfAuthenticated: "/", // Redirect jika sudah login
    },
  ];

  // Cari aturan untuk halaman yang diminta
  const route = routes.find((r) => nextUrl.pathname.startsWith(r.path));

  if (route) {
    const isLoggedIn = !!session;

    // Redirect jika pengguna tidak login dan halaman memerlukan autentikasi
    if (!isLoggedIn && route.requiresAuth) {
      return NextResponse.redirect(
        new URL(route.redirectIfUnauthenticated ?? "", nextUrl.origin)
      );
    }

    // Redirect jika pengguna sudah login dan halaman tidak memerlukan autentikasi
    if (isLoggedIn && route.redirectIfAuthenticated) {
      return NextResponse.redirect(
        new URL(route.redirectIfAuthenticated, nextUrl.origin)
      );
    }
  }

  // Untuk semua kasus lainnya, izinkan permintaan
  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/signup", "/dashboard", "/"], // Tentukan URL yang akan diperiksa
};
