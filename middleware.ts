import { auth } from "./src/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  if (
    pathname.startsWith("/admin") &&
    userRole !== "ADMIN" &&
    userRole !== "MECHANIC"
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
