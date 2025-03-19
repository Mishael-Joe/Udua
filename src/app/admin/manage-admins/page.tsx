"use client";

import type React from "react";

import { withAdminAuth } from "../components/auth/with-admin-auth";
import { PERMISSIONS, ROLES } from "@/lib/rbac/permissions";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  lastLogin?: string;
}

interface AdminFormData {
  name: string;
  email: string;
  password: string;
  roles: string[];
}

function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    name: "",
    email: "",
    password: "",
    roles: [],
  });
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/admins");
      setAdmins(response.data.admins);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch admins",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      roles: [],
    });
    setError(null);
    setSuccess(null);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      formData.roles.length === 0
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post("/api/admin/admins", formData);
      setSuccess("Admin created successfully");

      // Reset form and close dialog after a delay
      setTimeout(() => {
        resetForm();
        setIsAddDialogOpen(false);
        fetchAdmins(); // Refresh the admin list
      }, 5000);
    } catch (error: any) {
      console.error("Error creating admin:", error);
      setError(error.response?.data?.error || "Failed to create admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "", // Don't set password when editing
      roles: admin.roles,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.name || !formData.email || formData.roles.length === 0) {
      setError("Name, email, and at least one role are required");
      return;
    }

    try {
      setSubmitting(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        roles: formData.roles,
        // Only include password if it was provided
        ...(formData.password ? { password: formData.password } : {}),
      };

      const response = await axios.put(
        `/api/admin/admins/${editingAdmin._id}`,
        updateData
      );
      setSuccess("Admin updated successfully");

      // Reset form and close dialog after a delay
      setTimeout(() => {
        resetForm();
        setIsEditDialogOpen(false);
        setEditingAdmin(null);
        fetchAdmins(); // Refresh the admin list
      }, 1500);
    } catch (error: any) {
      console.error("Error updating admin:", error);
      setError(error.response?.data?.error || "Failed to update admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    try {
      const response = await axios.put(`/api/admin/admins/${admin._id}`, {
        isActive: !admin.isActive,
      });

      toast({
        title: "Success",
        description: `Admin ${
          admin.isActive ? "deactivated" : "activated"
        } successfully`,
      });

      fetchAdmins(); // Refresh the admin list
    } catch (error: any) {
      console.error("Error toggling admin status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.error || "Failed to update admin status",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>

      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add New Admin
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Name</th>
                <th className="py-2 px-4 border text-left">Email</th>
                <th className="py-2 px-4 border text-left">Roles</th>
                <th className="py-2 px-4 border text-left">Status</th>
                <th className="py-2 px-4 border text-left">Last Login</th>
                <th className="py-2 px-4 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td className="py-2 px-4 border">{admin.name}</td>
                  <td className="py-2 px-4 border">{admin.email}</td>
                  <td className="py-2 px-4 border">
                    {admin.roles.map((role) => (
                      <span
                        key={role}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                      >
                        {role.replace(/_/g, " ")}
                      </span>
                    ))}
                  </td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        admin.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="py-2 px-4 border">
                    <Button
                      variant="ghost"
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEditAdmin(admin)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className={
                        admin.isActive
                          ? "text-red-500 hover:text-red-700"
                          : "text-green-500 hover:text-green-700"
                      }
                      onClick={() => handleToggleStatus(admin)}
                    >
                      {admin.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAdmin}>
            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Roles</Label>
                <div className="col-span-3 space-y-2">
                  {Object.entries(ROLES).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${value}`}
                        checked={formData.roles.includes(value)}
                        onCheckedChange={() => handleRoleToggle(value)}
                      />
                      <Label htmlFor={`role-${value}`} className="capitalize">
                        {value.replace(/_/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAdmin}>
            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="edit-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Roles</Label>
                <div className="col-span-3 space-y-2">
                  {Object.entries(ROLES).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-role-${value}`}
                        checked={formData.roles.includes(value)}
                        onCheckedChange={() => handleRoleToggle(value)}
                      />
                      <Label
                        htmlFor={`edit-role-${value}`}
                        className="capitalize"
                      >
                        {value.replace(/_/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                  setEditingAdmin(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Admin"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAdminAuth(ManageAdminsPage, {
  requiredPermissions: [PERMISSIONS.MANAGE_ADMINS],
});

// "use client";

// import { withAdminAuth } from "../components/auth/with-admin-auth";
// import { PERMISSIONS } from "@/lib/rbac/permissions";
// import { useState, useEffect } from "react";
// import axios from "axios";

// interface AdminUser {
//   _id: string;
//   name: string;
//   email: string;
//   roles: string[];
//   isActive: boolean;
//   lastLogin?: string;
// }

// function ManageAdminsPage() {
//   const [admins, setAdmins] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAdmins = async () => {
//       try {
//         const response = await axios.get("/api/admin/admins");
//         setAdmins(response.data.admins);
//       } catch (error) {
//         console.error("Error fetching admins:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdmins();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>

//       <div className="mb-4 flex justify-end">
//         <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Add New Admin
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-4 border text-left">Name</th>
//                 <th className="py-2 px-4 border text-left">Email</th>
//                 <th className="py-2 px-4 border text-left">Roles</th>
//                 <th className="py-2 px-4 border text-left">Status</th>
//                 <th className="py-2 px-4 border text-left">Last Login</th>
//                 <th className="py-2 px-4 border text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {admins.map((admin) => (
//                 <tr key={admin._id}>
//                   <td className="py-2 px-4 border">{admin.name}</td>
//                   <td className="py-2 px-4 border">{admin.email}</td>
//                   <td className="py-2 px-4 border">
//                     {admin.roles.map((role) => (
//                       <span
//                         key={role}
//                         className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
//                       >
//                         {role.replace("_", " ")}
//                       </span>
//                     ))}
//                   </td>
//                   <td className="py-2 px-4 border">
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${
//                         admin.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {admin.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="py-2 px-4 border">
//                     {admin.lastLogin
//                       ? new Date(admin.lastLogin).toLocaleString()
//                       : "Never"}
//                   </td>
//                   <td className="py-2 px-4 border">
//                     <button className="text-blue-500 hover:text-blue-700 mr-2">
//                       Edit
//                     </button>
//                     <button className="text-red-500 hover:text-red-700">
//                       {admin.isActive ? "Deactivate" : "Activate"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default withAdminAuth(ManageAdminsPage, {
//   requiredPermissions: [PERMISSIONS.MANAGE_ADMINS],
// });

// import { Suspense } from "react";
// import ManageAdmins from "../components/manage-admins";

// export default async function Page() {
//   return (
//     <div className="py-4">
//       <Suspense fallback={"Admin dashboard"}>
//         <ManageAdmins />
//       </Suspense>
//     </div>
//   );
// }
