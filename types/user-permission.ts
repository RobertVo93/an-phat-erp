import { UserRole } from "./enums"

export interface PagePermission {
  id: string
  name: string
  label: string
  href: string
  category: string
  description?: string
}

export interface UserPagePermission {
  userId: string
  pageId: string
  granted: boolean
}

export interface PermissionCategory {
  id: string
  name: string
  title: string
  children: PagePermission[]
}

// Map directly to your sidebar navigation structure
export const PAGE_PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: "monitoring",
    name: "monitoring",
    title: "Monitoring",
    children: [
      { id: "home", name: "home", label: "Dashboard", href: "/", category: "monitoring" },
      { id: "orders", name: "orders", label: "Orders", href: "/orders", category: "monitoring" },
      { id: "products", name: "products", label: "Products", href: "/products", category: "monitoring" },
      { id: "collections", name: "collections", label: "Collections", href: "/collections", category: "monitoring" },
      { id: "customers", name: "customers", label: "Customers", href: "/customers", category: "monitoring" },
    ],
  },
  {
    id: "employee",
    name: "employee",
    title: "Employee Management",
    children: [
      { id: "employee", name: "employee", label: "Employee", href: "/employee", category: "employee" },
      { id: "attendance", name: "attendance", label: "Attendance", href: "/attendance", category: "employee" },
      { id: "payroll", name: "payroll", label: "Payroll", href: "/payroll", category: "employee" },
    ],
  },
  {
    id: "marketing",
    name: "marketing",
    title: "Marketing",
    children: [{ id: "discounts", name: "discounts", label: "Discounts", href: "/discounts", category: "marketing" }],
  },
  {
    id: "warehouses",
    name: "warehouses",
    title: "Warehouses",
    children: [
      { id: "warehouse", name: "warehouse", label: "Warehouse", href: "/warehouse", category: "warehouses" },
      { id: "stock_in", name: "stock_in", label: "Stock-in", href: "/stock-in", category: "warehouses" },
      { id: "stock_out", name: "stock_out", label: "Stock-out", href: "/stock-out", category: "warehouses" },
      { id: "produce", name: "produce", label: "Production", href: "/produce", category: "warehouses" },
    ],
  },
  {
    id: "utilities",
    name: "utilities",
    title: "Utilities",
    children: [
      { id: "utility", name: "utility", label: "Utility", href: "/utility", category: "utilities" },
      { id: "invoice", name: "invoice", label: "Invoice", href: "/invoice", category: "utilities" },
    ],
  },
  {
    id: "reports",
    name: "reports",
    title: "Reports",
    children: [
      {
        id: "reports_daily",
        name: "reports_daily",
        label: "Daily Report",
        href: "/reports/daily",
        category: "reports",
      },
      {
        id: "reports_employee",
        name: "reports_employee",
        label: "Employee Report",
        href: "/reports/employee",
        category: "reports",
      },
      {
        id: "reports_order",
        name: "reports_order",
        label: "Order Report",
        href: "/reports/order",
        category: "reports",
      },
      {
        id: "reports_stock",
        name: "reports_stock",
        label: "Stock Report",
        href: "/reports/stock",
        category: "reports",
      },
      {
        id: "reports_customer",
        name: "reports_customer",
        label: "Customer Report",
        href: "/reports/customer",
        category: "reports",
      },
      {
        id: "reports_activity",
        name: "reports_activity",
        label: "Operating Report",
        href: "/reports/activity",
        category: "reports",
      },
      {
        id: "reports_utility",
        name: "reports_utility",
        label: "Utility Report",
        href: "/reports/utility",
        category: "reports",
      },
    ],
  },
  {
    id: "admin",
    name: "admin",
    title: "Administration",
    children: [
      { id: "permissions", name: "permissions", label: "User Permissions", href: "/permissions", category: "admin" },
    ],
  },
]

export const ROLE_LABELS = {
  [UserRole.super_admin]: "Super Admin",
  [UserRole.admin]: "Admin",
  [UserRole.manager]: "Manager",
  [UserRole.staff]: "Staff",
  [UserRole.customer]: "Customer",
} as const

// Default page access by role
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: PAGE_PERMISSION_CATEGORIES.flatMap((cat) => cat.children.map((page) => page.id)),
  admin: [
    "home",
    "orders",
    "products",
    "collections",
    "customers",
    "employee",
    "attendance",
    "payroll",
    "discounts",
    "warehouse",
    "stock_in",
    "stock_out",
    "produce",
    "utility",
    "invoice",
    "reports_daily",
    "reports_employee",
    "reports_order",
    "reports_stock",
    "reports_customer",
    "reports_activity",
    "reports_utility",
  ],
  manager: [
    "home",
    "orders",
    "products",
    "collections",
    "customers",
    "attendance",
    "warehouse",
    "stock_in",
    "stock_out",
    "produce",
    "reports_daily",
    "reports_stock",
    "reports_activity",
  ],
  staff: ["home", "orders", "products", "collections", "attendance", "warehouse", "stock_in", "stock_out"],
  customer: ["home", "orders"],
}
