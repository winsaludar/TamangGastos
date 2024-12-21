import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export async function middleware(req) {
  console.log("Middleware is running...");

  if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get("token") || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // The routes you want to protect (can be left broad or fine-tuned as needed)
};
