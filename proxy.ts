import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths without token check
  const publicPaths = [
    "/api/auth",
    "/_next",
    "/favicon.ico",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token for all other routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to dashboard if authenticated and trying to access login
  if (token && pathname === "/login") {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect root to dashboard if authenticated, to login if not
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
