"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { cookies } from "next/headers";

// Type for the options that can be passed to the HOC
interface WithAuthOptions {
  // The cookie key to check for authentication
  cookieKey?: string;
  // The route to redirect to if not authenticated
  redirectTo?: string;
}

// Default options
const defaultOptions: WithAuthOptions = {
  cookieKey: "token",
  redirectTo: "/sign-in",
};

/**
 * Higher-Order Component that checks if a user is authenticated
 * by verifying if a specific cookie exists
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions
) {
  const { cookieKey, redirectTo } = { ...defaultOptions, ...options };

  // Create a new component that wraps the original component
  function AuthComponent(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      // Check if the cookie exists
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cookieKey}=`))
        ?.split("=")[1];

      if (!cookieValue) {
        // If the cookie doesn't exist, redirect to login
        // router.push(redirectTo || "/login");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    // Show nothing while checking authentication
    if (isAuthenticated === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // If authenticated, render the component
    return <Component {...props} isAuthenticated={isAuthenticated} />;
  }

  // Set the display name for the component
  const displayName = Component.displayName || Component.name || "Component";
  AuthComponent.displayName = `withAuth(${displayName})`;

  return AuthComponent;
}

/**
 * Server-side function to check if a user is authenticated
 * This can be used in Server Components or middleware
 */
// export async function isAuthenticated(options?: WithAuthOptions): Promise<boolean> {
//   const { cookieKey } = { ...defaultOptions, ...options }
//   const cookieStore = cookies()
//   const session = cookieStore.get(cookieKey)

//   return !!session
// }
