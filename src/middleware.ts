// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];

const authRoutes = ["/login", "/signup"]; // Routes that authenticated users shouldn't access

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Get token from cookie or header
  const token =
    request.cookies.get("authToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Validate token
  const isAuthenticated = token ? isValidToken(token) : false;

  // Redirect unauthenticated users trying to access protected routes
  // if (isProtectedRoute && !isAuthenticated) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("redirect", path); // Save intended destination
  //   return NextResponse.redirect(loginUrl);
  // }

  // // Redirect authenticated users away from auth pages
  // if (isAuthRoute && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

function isValidToken(token: string): boolean {
  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)",
  ],
};
