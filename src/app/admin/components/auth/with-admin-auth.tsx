"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Permission } from "@/lib/rbac/permissions";
import axios from "axios";

interface AdminAuthProps {
  requiredPermissions?: Permission[];
}

export interface AdminData {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  { requiredPermissions = [] }: AdminAuthProps = {}
) {
  return function WithAdminAuth(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<AdminData | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get<{
            admin: AdminData;
            permissions: Permission;
          }>("/api/admin/verify-auth");
          const { admin, permissions } = response.data;

          setAdmin(admin);

          // Check if admin has required permissions
          if (requiredPermissions.length > 0) {
            const hasRequiredPermission = requiredPermissions.some(
              (permission) => permissions.includes(permission)
            );

            if (!hasRequiredPermission) {
              router.push("/admin/forbidden");
              return;
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Authentication error:", error);
          router.push(
            "/admin-sign-in?callbackUrl=" +
              encodeURIComponent(window.location.pathname)
          );
        }
      };

      checkAuth();
    }, [router, requiredPermissions]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return <Component {...props} admin={admin} />;
  };
}
