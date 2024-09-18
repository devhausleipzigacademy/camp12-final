import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // pathname
  const getPathname = request.nextUrl.pathname + request.nextUrl.search;

  const regex = new RegExp("\\.(png|jpg|txt|jpeg|gif|svg|ico)|login");

  if (!regex.test(getPathname)) {
    response.cookies.set("location", getPathname, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // Optional: one week expiration
      sameSite: "lax",
    });
  }
  return response;
}

//matcher checks only routes that matches specific calls

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*|/login)",
  ],
};
