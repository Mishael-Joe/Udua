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
    "/partner-with-udua",
    // /^\/products\/.*/, // Regular expression for matching products path
  ]; // Array of public paths

  const storePaths = [
    "/dash-board",
    "/editProduct",
    "/my-products",
    "/my-store",
    "/uploadProduct",
    "/security",
    "/payout",
  ]; // Array of store paths

  const adminPaths = [
    "/create-store",
    "/dispute-resolution",
    "/manage-admins",
    "/settlement",
    "/order-details",
    "/verify-products",
    "/verify-seller",
  ]; // Array of admin paths

  const adminToken = request.cookies.get("adminToken")?.value || "";
  const storeToken = request.cookies.get("storeToken")?.value || "";
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

  // Helper function to check if path matches any admin path
  const isAdminPath = (path: string) => {
    return adminPaths.some((adminPath) => {
      if (adminPaths.includes(adminPath) && path.startsWith("/admin/")) {
        // This checks if it's a dynamic store path
        return path.endsWith(adminPath);
      }
      return adminPath === path;
    });
  };

  // Helper function to check if path matches any store path
  const isStorePath = (path: string) => {
    return storePaths.some((storePath) => {
      if (storePaths.includes(storePath) && path.startsWith("/store/")) {
        // This checks if it's a dynamic store path
        return path.endsWith(storePath);
      }
      return storePath === path;
    });
  };

  // If the pathname is public and user has the token, prevent access to sign-in & sign-up pages
  if (isPublicPath(pathName) && token) {
    if (pathName === "/sign-in" || pathName === "/sign-up") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If the pathname is not public and user does not have the token then you cannot visit the protected pages
  if (!isPublicPath(pathName) && !token) {
    // return NextResponse.redirect(new URL("/sign-in", request.url));
    const signInUrl = new URL("/sign-in", request.url);
    // Append the current page (callback URL) to the query parameters
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If the pathname is admin and user does not have the token then you cannot visit the protected pages
  if (isAdminPath(pathName) && !adminToken) {
    // return NextResponse.redirect(new URL("/sign-in", request.url));
    const signInUrl = new URL("/admin-sign-in", request.url);
    // Append the current page (callback URL) to the query parameters
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If the pathname is store and user does not have the store token then you cannot visit the protected pages
  if (isStorePath(pathName) && !storeToken) {
    // return NextResponse.redirect(new URL("/sign-in", request.url));
    const signInUrl = new URL("/login", request.url);
    // Append the current page (callback URL) to the query parameters
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
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
    "/partner-with-udua",
    "/partner-with-udua/create-store",
    // "/api/(.*)",
    "/store/:path*/my-store", // Matching dynamic storeId path
    "/store/:path*/dash-board", // Matching dynamic storeId path
    "/store/:path*/payout", // Matching dynamic storeId path
    "/store/:path*/security", // Matching dynamic storeId path
    "/store/:path*/uploadProduct ", // Matching dynamic storeId path
    "/store/:path*/editProduct ", // Matching dynamic storeId path
    "/store/:path*/my-products ", // Matching dynamic storeId path
    "/admin/create-store",
    "/admin/dispute-resolution",
    "/admin/manage-admins",
    "/admin/settlement",
    "/admin/order-details",
    "/admin/verify-products",
    "/admin/verify-seller",
  ],
};
