import { NextResponse } from "next/server";
import { TOKEN_NAME } from "./until";

// This function can be marked `async` if using `await` inside
export default function middleware(request) {
  const token = request.cookies.get(TOKEN_NAME);

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/myEvents/:path*",
    "/myBookings/:path*",
    "/myEarning/:path*",
    "/notification/:path*",
    "/joinUsEvent/:path*",
    "/messaging/:path*",
    "/profile/:path*",
    // "/upcomingEvents/:path*",
  ],
};
