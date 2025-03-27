// Define all possible admin permissions
export const PERMISSIONS = {
  // Product permissions
  VIEW_PRODUCTS: "view_products",
  CREATE_PRODUCT: "create_product",
  EDIT_PRODUCT: "edit_product",
  DELETE_PRODUCT: "delete_product",
  VERIFY_PRODUCT: "verify_product",
  UNVERIFY_PRODUCT: "unverify_product",

  // Order permissions
  VIEW_ORDERS: "view_orders",
  UPDATE_ORDER: "update_order",
  CANCEL_ORDER: "cancel_order",

  // Store permissions
  VIEW_STORES: "view_stores",
  CREATE_STORE: "create_store",
  EDIT_STORE: "edit_store",
  VERIFY_STORE: "verify_store",

  // Customer support permissions
  VIEW_TICKETS: "view_tickets",
  RESPOND_TICKET: "respond_ticket",
  CLOSE_TICKET: "close_ticket",

  // Finance permissions
  VIEW_SETTLEMENTS: "view_settlements",
  PROCESS_SETTLEMENT: "process_settlement",
  VIEW_FINANCIAL_REPORTS: "view_financial_reports",

  // Admin management
  MANAGE_ADMINS: "manage_admins",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Define admin roles and their permissions
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  PRODUCT_ADMIN: "product_admin",
  ORDER_ADMIN: "order_admin",
  STORE_ADMIN: "store_admin",
  CUSTOMER_SUPPORT_ADMIN: "customer_support_admin",
  FINANCE_ADMIN: "finance_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.PRODUCT_ADMIN]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.VERIFY_PRODUCT,
  ],

  [ROLES.ORDER_ADMIN]: [
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.UPDATE_ORDER,
    PERMISSIONS.CANCEL_ORDER,
  ],

  [ROLES.STORE_ADMIN]: [
    PERMISSIONS.VIEW_STORES,
    PERMISSIONS.CREATE_STORE,
    PERMISSIONS.EDIT_STORE,
    PERMISSIONS.VERIFY_STORE,
  ],

  [ROLES.CUSTOMER_SUPPORT_ADMIN]: [
    PERMISSIONS.VIEW_TICKETS,
    PERMISSIONS.RESPOND_TICKET,
    PERMISSIONS.CLOSE_TICKET,
    PERMISSIONS.VIEW_ORDERS, // Need to view orders to help customers
  ],

  [ROLES.FINANCE_ADMIN]: [
    PERMISSIONS.VIEW_SETTLEMENTS,
    PERMISSIONS.PROCESS_SETTLEMENT,
    PERMISSIONS.VIEW_FINANCIAL_REPORTS,
  ],
};

// Define route permissions mapping
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  // Product routes
  "/admin/products": [PERMISSIONS.VIEW_PRODUCTS],
  "/admin/create-product": [PERMISSIONS.CREATE_PRODUCT],
  "/admin/edit-product": [PERMISSIONS.EDIT_PRODUCT],
  "/admin/verify-products": [PERMISSIONS.VERIFY_PRODUCT],

  // Order routes
  "/admin/orders": [PERMISSIONS.VIEW_ORDERS],
  "/admin/order-details": [PERMISSIONS.VIEW_ORDERS],

  // Store routes
  "/admin/stores": [PERMISSIONS.VIEW_STORES],
  "/admin/create-store": [PERMISSIONS.CREATE_STORE],
  "/admin/edit-store": [PERMISSIONS.EDIT_STORE],
  "/admin/verify-seller": [PERMISSIONS.VERIFY_STORE],

  // Customer support routes
  "/admin/customer-tickets": [PERMISSIONS.VIEW_TICKETS],
  "/admin/support-dashboard": [PERMISSIONS.VIEW_TICKETS],

  // Finance routes
  "/admin/settlement": [
    PERMISSIONS.VIEW_SETTLEMENTS,
    PERMISSIONS.PROCESS_SETTLEMENT,
  ],
  "/admin/financial-reports": [PERMISSIONS.VIEW_FINANCIAL_REPORTS],

  // Admin management
  "/admin/manage-admins": [PERMISSIONS.MANAGE_ADMINS],

  // Dashboard can be accessed by any admin
  "/admin/dashboard": [],
};

// Helper function to check if a user has the required permissions
export function hasPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  if (requiredPermissions.length === 0) return true;
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

// Helper function to get permissions for a set of roles
export function getPermissionsForRoles(roles: Role[]): Permission[] {
  return roles.flatMap((role) => ROLE_PERMISSIONS[role] || []);
}
