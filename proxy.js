
import { NextResponse } from "next/server";

export function proxy(request) {
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/t-shirts",
    "/warenkorb",
    "/checkout",
  ];

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isProtected && process.env.NODE_ENV === "production") {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/t-shirts/:path*",
    "/warenkorb/:path*",
    "/checkout/:path*",
  ],
};
