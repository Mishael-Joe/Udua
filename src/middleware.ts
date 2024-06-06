import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
// Note: This is the logic part of the middleware
export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const publicPaths = ["/", "/sign-in", "/sign-up"]; // Array of public paths

  const token = request.cookies.get("token")?.value || "";

  // If the pathname is public and user has the token then you cannot visit the sign-in & sign-up page
  if (publicPaths.includes(pathName) && token && pathName !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the pathname is not public and user does not have the token then you cannot visit the protected pages
  if (!publicPaths.includes(pathName) && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
// Note: This is the Matching part of the middleware
export const config = {
  matcher: ["/", "/sign-up", "/sign-in", "/profile"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// // Note: This is the  logic part of the middleware
// export function middleware(request: NextRequest) {
//   const pathName = request.nextUrl.pathname;

//   const isPublic = pathName === `/sign-in` || pathName === `sign-up`;

//   const token = request.cookies.get("token")?.value || "";

//   // if the pathname is public and user has the token then you cann't visit the sign-in & sign-up page
//   if (isPublic && token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // if the pathname is not public and user does not have the token then you cann't visit the sign-in & sign-up page
//   if (!isPublic && !token) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }
// }

// // See "Matching Paths" below to learn more
// // Note: This is the Matching part of the middleware
// export const config = {
//   matcher: ["/", "/sign-up", "/sign-in", "/profile"],
// };
