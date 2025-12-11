import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the protected routes
const protectedRoutes = ["/dashboard", "/profile", "/"];
const publicRoutes = ["/login", "/signup", "/"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Check if a session cookie exists (optimistic check)
  const sessionCookie = request.cookies.get("session")?.value;

  if (isProtectedRoute && !sessionCookie) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && sessionCookie && path !== "/dashboard") {
    // Redirect authenticated users away from login/signup pages
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" documentation for more details on advanced matchers
export const config = {
  // Match all routes except those for static files and API routes that don't need auth checks
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
