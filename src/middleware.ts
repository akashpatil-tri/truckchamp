// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Currently, authentication is handled server-side via API calls
  // Middleware protection can be enabled when needed
  return NextResponse.next();
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
