// import { NextResponse, type NextRequest } from "next/server";

// // Routes that don't require authentication
// const publicRoutes = ["/login", "/register", "/forgot-password"];

// // Routes that should redirect to dashboard if already authenticated
// const authRoutes = ["/login", "/register", "/forgot-password"];

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Get token from cookies (set this when logging in)
//   const token = request.cookies.get("authToken")?.value;

//   const isPublicRoute = publicRoutes.some(
//     (route) => pathname === route || pathname.startsWith(`${route}/`)
//   );
//   const isAuthRoute = authRoutes.some(
//     (route) => pathname === route || pathname.startsWith(`${route}/`)
//   );

//   // If user is not authenticated and trying to access protected route
//   if (!token && !isPublicRoute) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // If user is authenticated and trying to access auth routes (login, register, etc.)
//   if (token && isAuthRoute) {
//     // Redirect to appropriate dashboard based on user role
//     // For now, redirect to a default dashboard
//     return NextResponse.redirect(
//       new URL("/truck-operator/dashboard", request.url)
//     );
//   }

//   // Set the pathname header for server components to access
//   const response = NextResponse.next();
//   response.headers.set("x-pathname", pathname);
//   return response;
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - api routes
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      * - public files (images, etc.)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)",
//   ],
// };
