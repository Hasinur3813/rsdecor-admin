import { NextResponse } from "next/server";
import {
  ADMIN_ROLES,
  PUBLIC_PATHS,
  buildLoginUrl,
  validateRedirectUrl,
} from "./src/lib/authConstants";

const STATIC_PREFIX = "/_next";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith(STATIC_PREFIX) ||
    pathname === "/favicon.ico" ||
    pathname.match(
      /\.(png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot|ico|webp|map)$/i,
    )
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("rs_access_token")?.value;
  const refreshToken = request.cookies.get("rs_refresh_token")?.value;
  const hasAnyToken = Boolean(accessToken || refreshToken);

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isPublicPath) {
    if (hasAnyToken) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const safeRedirect = validateRedirectUrl(redirectParam);
      return NextResponse.redirect(new URL(safeRedirect, request.url));
    }
    return NextResponse.next();
  }

  if (!hasAnyToken) {
    const login = buildLoginUrl(pathname, "auth_required");
    return NextResponse.redirect(new URL(login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};

export { ADMIN_ROLES, buildLoginUrl, validateRedirectUrl, PUBLIC_PATHS };
