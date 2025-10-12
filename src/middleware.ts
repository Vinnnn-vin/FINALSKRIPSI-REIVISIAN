// src\middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    if (pathname === "/frontend/dashboard") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/frontend/dashboard/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/frontend/auth/unauthorized", req.url));
    }
    
    if (pathname.startsWith("/frontend/dashboard/lecturer") && 
        token?.role !== "lecturer" && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/frontend/auth/unauthorized", req.url));
    }

    if (pathname.startsWith("/frontend/dashboard/student") && 
        token?.role !== "student" && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/frontend/auth/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === "/frontend/dashboard") {
          return !!token;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/frontend/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/frontend/dashboard/:path*",
    "/admin/:path*",
    "/instructor/:path*",
  ],
};