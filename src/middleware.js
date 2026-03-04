import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  // Use getToken for NextAuth v4 to retrieve session in Edge Runtime
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // No token = not logged in, redirect to login
  if (!token?.accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// List every route you want to protect here
export const config = {
  matcher: [
    "/product/:path*",
  ],
};