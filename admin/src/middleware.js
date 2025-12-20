import { NextResponse } from "next/server";
import { TOKEN_NAME } from "./until";

// This function can be marked `async` if using `await` inside
export default function middleware(request) {
  const token = request.cookies.get(TOKEN_NAME);

  if (!token) {
    return NextResponse.redirect(new URL("/adminsa111xyz", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/organizer/:path*",
    "/about-us",
    "/testimonial/:path*",
    "/blog/:path*",
    "/gallery/:path*",
    "/careers/:path*",
    "/enquiry",
    "/contact",
    "/cms",
    "/change-password",
    "/user/:path*",
    "/events/:path*",
    "/setting/:path*",
    "/admin-management/:path*",
    "/wallet/:path*",
    "/withdrawal-requests/:path*",
  ],
};
