import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  const searchParamsObject = Object.fromEntries(searchParams.entries());
  const objectKeys = Object.keys(searchParamsObject);

  const cleanUrl = `${url.origin}${url.pathname}`;

  // Protect /content routes - require authentication
  if (pathname.startsWith("/content")) {
    const session = request.cookies.get("session");
    const userData = request.cookies.get("user-data");

    if (!session || !userData) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/auth/login", url.origin);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect /content to /content/news/
    if (pathname === "/content" || pathname === "/content/") {
      const redirectUrl = url.clone();
      redirectUrl.pathname = "/content/news/";
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // Handle mode query parameter
  if (objectKeys.length == 1 && objectKeys.includes("mode")) {
    const mode = searchParamsObject["mode"];
    if (mode !== "view" && mode !== "edit") {
      return NextResponse.redirect(cleanUrl);
    }
    const session = request.cookies.get("session");

    if (!session) {
      return NextResponse.redirect(cleanUrl);
    }

    return NextResponse.next();
  } else if (objectKeys.length > 0) {
    return NextResponse.redirect(cleanUrl);
  }

  if (
    request.nextUrl.pathname === "/auth" ||
    request.nextUrl.pathname === "/auth/"
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
