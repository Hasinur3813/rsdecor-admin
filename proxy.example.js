import { NextResponse } from "next/server";

export function proxy(request) {
  const token =
    request.cookies.get("rs_access_token")?.value ||
    request.cookies.get("rs_refresh_token")?.value;
  const path = request.nextUrl.pathname;

  // console.log(token);

  // Paths that do not require authentication
  const isPublicPath = path === "/login";

  if (isPublicPath && token) {
    // If the user has a token and tries to access the login page, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !token) {
    // If the user has no token and tries to access a protected route, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any files with an extension (e.g. .svg, .png, .jpg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
