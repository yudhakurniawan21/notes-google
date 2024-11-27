import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  console.log("Middleware triggered for:", nextUrl.pathname);
  console.log("Session:", session);

  const routes = [
    {
      path: "/dashboard",
      requiresAuth: true,
      redirectIfUnauthenticated: "/login",
    },
    {
      path: "/login",
      requiresAuth: false,
      redirectIfAuthenticated: "/",
    },
    {
      path: "/signup",
      requiresAuth: false,
      redirectIfAuthenticated: "/",
    },
  ];

  const route = routes.find((r) => nextUrl.pathname.startsWith(r.path));

  if (route) {
    const isLoggedIn = !!session;
    console.log("Route found:", route);

    if (!isLoggedIn && route.requiresAuth) {
      console.log("Redirecting to:", route.redirectIfUnauthenticated);
      return NextResponse.redirect(
        new URL(route.redirectIfUnauthenticated ?? "", nextUrl.origin)
      );
    }

    if (isLoggedIn && route.redirectIfAuthenticated) {
      console.log("Redirecting to:", route.redirectIfAuthenticated);
      return NextResponse.redirect(
        new URL(route.redirectIfAuthenticated, nextUrl.origin)
      );
    }
  }

  console.log("No rules matched, proceeding to next response.");
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
