import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, getAdminPermissions } from "./lib/rbac/jwt-utils";
import { ROUTE_PERMISSIONS, hasPermission } from "./lib/rbac/permissions";

// This function can be marked `async` if using `await` inside
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
    "/admin-sign-in", // Admin sign-in page
  ];

  const storePaths = [
    "/dash-board",
    "/editProduct",
    "/my-products",
    "/my-store",
    "/uploadProduct",
    "/security",
    "/payout",
  ];

  // Check if the path is an admin path
  const isAdminPath =
    pathName.startsWith("/admin/") ||
    ["/admin-dashboard", "/admin-sign-in"].includes(pathName);

  const adminToken = request.cookies.get("adminToken")?.value || "";
  const storeToken = request.cookies.get("storeToken")?.value || "";
  const token = request.cookies.get("token")?.value || "";
  // console.log("Admin Token:", adminToken);

  // Helper function to check if path matches any public path
  const isPublicPath = (path: string) => {
    return publicPaths.some((publicPath) => publicPath === path);
  };

  // Helper function to check if path matches any store path
  const isStorePath = (path: string) => {
    return storePaths.some((storePath) => {
      if (storePaths.includes(storePath) && path.startsWith("/store/")) {
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
  if (
    !isPublicPath(pathName) &&
    !token &&
    !isAdminPath &&
    !isStorePath(pathName)
  ) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle admin routes with RBAC
  if (isAdminPath && pathName !== "/admin-sign-in") {
    // If no admin token, redirect to admin sign-in
    if (!adminToken) {
      const signInUrl = new URL("/admin-sign-in", request.url);
      signInUrl.searchParams.set(
        "callbackUrl",
        request.nextUrl.pathname || "/admin/dashboard"
      );
      return NextResponse.redirect(signInUrl);
    }

    // Verify admin token and check permissions
    const adminData = await verifyAdminToken(adminToken);
    // console.log("Admin Data:", adminData);
    if (!adminData) {
      // Invalid token, redirect to admin sign-in
      const signInUrl = new URL("/admin-sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Get admin permissions based on roles
    const adminPermissions = getAdminPermissions(adminData.roles);

    // Check if admin has permission to access this route
    const requiredPermissions = ROUTE_PERMISSIONS[pathName] || [];
    // console.log("pathName:", pathName);
    // console.log("Required Permissions:", requiredPermissions);
    // console.log("Admin Permissions:", adminPermissions);
    if (!hasPermission(adminPermissions, requiredPermissions)) {
      // Admin doesn't have permission, redirect to forbidden page
      return NextResponse.redirect(new URL("/admin/forbidden", request.url));
    }
  }

  // If the pathname is store and user does not have the store token then you cannot visit the protected pages
  if (isStorePath(pathName) && !storeToken) {
    const signInUrl = new URL("/login", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Add this export to use Node.js runtime instead of Edge Runtime
export const config = {
  matcher: [
    // Include existing matchers
    "/",
    "/sign-up",
    "/sign-in",
    "/about-us",
    "/privacy-policy",
    "/shipping-return-policy",
    "/terms-conditions",
    "/cart",
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
    "/store/:path*/my-store",
    "/store/:path*/dash-board",
    "/store/:path*/payout",
    "/store/:path*/security",
    "/store/:path*/uploadProduct",
    "/store/:path*/editProduct",
    "/store/:path*/my-products",

    // Add all admin routes
    "/admin-sign-in",
    "/admin/dashboard",
    "/admin/products",
    "/admin/create-product",
    "/admin/edit-product/:path*",
    "/admin/verify-products",
    "/admin/orders",
    "/admin/order-details/:path*",
    "/admin/stores",
    "/admin/create-store",
    "/admin/edit-store/:path*",
    "/admin/verify-seller",
    "/admin/customer-tickets",
    "/admin/support-dashboard",
    "/admin/settlement",
    "/admin/financial-reports",
    "/admin/manage-admins",
    "/admin/forbidden",
  ],
  runtime: "nodejs", // This tells Next.js to use Node.js runtime
};
