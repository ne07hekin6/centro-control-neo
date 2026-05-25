import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  isAccessProtectionEnabled,
  isDashboardConfigurationLocked,
  isValidAccessCookie,
} from "@/lib/auth";

function isPublicPath(pathname: string) {
  return (
    pathname === "/unlock" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isDashboardConfigurationLocked()) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Access protection must be configured." },
        { status: 503 },
      );
    }

    const setupUrl = new URL("/unlock", request.url);
    setupUrl.searchParams.set("setup", "required");
    return NextResponse.redirect(setupUrl);
  }

  if (!isAccessProtectionEnabled()) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  if (await isValidAccessCookie(accessCookie)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const unlockUrl = new URL("/unlock", request.url);
  if (pathname !== "/") {
    unlockUrl.searchParams.set("next", pathname);
  }

  return NextResponse.redirect(unlockUrl);
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
