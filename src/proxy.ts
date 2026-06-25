import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected app routes require authentication
const APP_ROUTES = ["/dashboard", "/clients", "/projects", "/auditions", "/quotes", "/invoices", "/settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAppRoute = APP_ROUTES.some((route) => pathname.startsWith(route));

  if (isAppRoute) {
    // Check for session token
    const token = request.cookies.get("authjs.session-token") || 
                  request.cookies.get("__Secure-authjs.session-token");
    
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
