import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
// Note: This is the logic part of the middleware
export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const publicPaths = [
    "/",
    "/sign-in",
    "/sign-up",
    "/about-us",
    "/privacy-policy",
    "/shipping-return-policy",
    "/terms-conditions",
    "/cart",
    "/seller-hub",
    // /^\/products\/.*/, // Regular expression for matching products path
  ]; // Array of public paths

  const token = request.cookies.get("token")?.value || "";

  // Helper function to check if path matches any public path
  const isPublicPath = (path: string) => {
    return publicPaths.some((publicPath) => {
      // if (publicPath instanceof RegExp) {
      //   return publicPath.test(path);
      // }
      return publicPath === path;
    });
  };

  // If the pathname is public and user has the token then you cannot visit the sign-in & sign-up page
  if (isPublicPath(pathName) && token && pathName !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the pathname is not public and user does not have the token then you cannot visit the protected pages
  if (!isPublicPath(pathName) && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
// Note: This is the Matching part of the middleware
export const config = {
  matcher: [
    "/",
    "/sign-up",
    "/sign-in",
    "/about-us",
    "/privacy-policy",
    "/shipping-return-policy",
    "/terms-conditions",
    "/cart",
    // /^\/products\/.*/,
    "/verification",
    "/checkout",
    "/profile",
    "/success",
    "/verification",
    "/dash-board",
    "/editProduct",
    "/my-products",
    "/orders",
    "/uploadProduct",
    "/seller-hub",
    "/seller-hub/join-us",
    // "/api/(.*)",
  ],
};
