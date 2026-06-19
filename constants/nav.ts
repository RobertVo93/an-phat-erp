import {
	User,
	Calendar,
	DollarSign,
	Percent,
	Building,
	Package,
	Zap,
	FileText,
	Clock,
	ShoppingBag,
	Box,
	Users,
	BarChart2,
	Home,
	ShoppingCart,
	Layers,
  NotebookPen,
  Settings,
} from "lucide-react"
import { NavItem } from "@/types/nav.interface"
import { UserRole } from "@/types/enums"
import { env } from "@/constants";

const DEFAULT_ADMIN_BASE_PATH = env.NEXT_PUBLIC_BASE_ZONE;

export function getAdminBasePath(): string {
  if (typeof process !== "undefined") {
    const envValue = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH;
    if (envValue && envValue.trim().length > 0) {
      const normalized = `/${envValue.replace(/^\/+|\/+$/g, "")}`;
      return normalized === "/" ? DEFAULT_ADMIN_BASE_PATH : normalized;
    }
  }
  return DEFAULT_ADMIN_BASE_PATH;
}

export function adminHref(path: string, query?: string): string {
  const base = getAdminBasePath();
  if (!path) return base;
  const normalizedPath = `/${path.replace(/^\/+/, "")}`;
  return `${base}${normalizedPath}`.replace(/\/{2,}/g, "/") + (query ? `?${query}` : "");
}

export const ADMIN_ROUTES = {
  base: getAdminBasePath(),
  home: (query?: string) => adminHref("/", query),
  login: () => adminHref("login"),
  register: () => adminHref("register"),
  forgotPassword: () => adminHref("forgot-password"),
  resetPassword: (token?: string) => adminHref("reset-password", token ? `token=${token}` : undefined),

  orders: (query?: string) => adminHref("orders", query),
  orderDetail: (id: string) => adminHref(`orders/${id}`),

  products: (query?: string) => adminHref("products", query),
  productDetail: (id: string) => adminHref(`products/${id}`),

  collections: (query?: string) => adminHref("collections", query),
  customers: (query?: string) => adminHref("customers", query),
	customerDetail: (id: string) => adminHref(`customers/${id}`),
  settingTheme: (query?: string) => adminHref("settings", query),

  employee: (query?: string) => adminHref("employee", query),
  attendance: (query?: string) => adminHref("attendance", query),
  payroll: (query?: string) => adminHref("payroll", query),

  discounts: (query?: string) => adminHref("discounts", query),

  warehouse: (query?: string) => adminHref("warehouse", query),
  warehouseDetail: (id: string) => adminHref(`warehouse/${id}`),
  stockChange: (query?: string) => adminHref("stock-change", query),
  stockChangeDetail: (id: string) => adminHref(`stock-change/${id}`),
  produce: (query?: string) => adminHref("produce", query),
  produceDetail: (idOrNumber: string) => adminHref(`produce/${encodeURIComponent(idOrNumber)}`),

  utility: (query?: string) => adminHref("utility", query),
  utilityUsage: (query?: string) => adminHref("utility-usage", query),
  invoice: (query?: string) => adminHref("invoice", query),

  reportsDaily: (query?: string) => adminHref("reports/daily", query),
  reportsEmployee: (query?: string) => adminHref("reports/employee", query),
  reportsOrder: (query?: string) => adminHref("reports/order", query),
  reportsStock: (query?: string) => adminHref("reports/stock", query),
  reportsCustomer: (query?: string) => adminHref("reports/customer", query),
  reportsActivity: (query?: string) => adminHref("reports/activity", query),
  reportsUtility: (query?: string) => adminHref("reports/utility", query),

  settingPermissions: () => adminHref("permissions"),
  settingPermissionUser: (id: string) => adminHref(`permissions/user/${id}`),
};

export const navItems: NavItem[] = [
	{
		id: "monitoring",
		name: "monitoring",
		title: "Monitoring",
		translationKey: "nav.monitoring",
		children: [
			{ id: "home", name: "home", title: "Home", translationKey: "nav.home", icon: Home, href: ADMIN_ROUTES.home() },
			{ id: "orders", name: "orders", title: "Orders", translationKey: "nav.orders", icon: ShoppingCart, href: ADMIN_ROUTES.orders() },
			{ id: "products", name: "products", title: "Products", translationKey: "nav.products", icon: Package, href: ADMIN_ROUTES.products() },
			{ id: "collections", name: "collections", title: "Collections", translationKey: "nav.collections", icon: Layers, href: ADMIN_ROUTES.collections() },
			{ id: "customers", name: "customers", title: "Customers", translationKey: "nav.customers", icon: Users, href: ADMIN_ROUTES.customers() },
		],
	},
	{
		id: "employee",
		name: "employee",
		title: "Employee",
		translationKey: "nav.employee",
		children: [
			{ id: "employee", name: "employee", title: "Employee", translationKey: "nav.employee", icon: User, href: ADMIN_ROUTES.employee() },
			{ id: "attendance", name: "attendance", title: "Attendance", translationKey: "nav.attendance", icon: Calendar, href: ADMIN_ROUTES.attendance() },
			{ id: "payroll", name: "payroll", title: "Payroll", translationKey: "nav.payroll", icon: DollarSign, href: ADMIN_ROUTES.payroll() },
		],
	},
	{
		id: "marketing",
		name: "marketing",
		title: "Marketing",
		translationKey: "nav.marketing",
		children: [{ id: "discounts", name: "discounts", title: "Discounts", translationKey: "nav.discounts", icon: Percent, href: ADMIN_ROUTES.discounts() }],
	},
	{
		id: "warehouses",
		name: "warehouses",
		title: "Warehouses",
		translationKey: "nav.warehouses",
		children: [
			{ id: "warehouse", name: "warehouse", title: "Warehouse", translationKey: "nav.warehouse", icon: Building, href: ADMIN_ROUTES.warehouse() },
			{ id: "stock_change", name: "stock_change", title: "Stock-change", translationKey: "nav.stockChange", icon: Package, href: ADMIN_ROUTES.stockChange() },
			{ id: "produce", name: "produce", title: "Production", translationKey: "nav.produce", icon: Zap, href: ADMIN_ROUTES.produce() },
		],
	},
	{
		id: "utilities",
		name: "utilities",
		title: "Utilities",
		translationKey: "nav.utilities",
		children: [
			{ id: "utility", name: "utility", title: "Utility", translationKey: "nav.utility", icon: Zap, href: ADMIN_ROUTES.utility() },
			{ id: "utility_usage", name: "utility_usage", title: "Usage", translationKey: "nav.usage", icon: NotebookPen, href: ADMIN_ROUTES.utilityUsage() },
			{ id: "invoice", name: "invoice", title: "Invoice", translationKey: "nav.invoice", icon: FileText, href: ADMIN_ROUTES.invoice() },
		],
	},
	{
		id: "reports",
		name: "reports",
		title: "Reports",
		translationKey: "nav.reports",
		children: [
			{ id: "reports_order", name: "reports_order", title: "Order report", translationKey: "nav.orderReport", icon: ShoppingBag, href: ADMIN_ROUTES.reportsOrder() },
			{ id: "reports_stock", name: "reports_stock", title: "Stock report", translationKey: "nav.stockReport", icon: Box, href: ADMIN_ROUTES.reportsStock() },
			{
				id: "reports_activity", name: "reports_activity", title: "Operating Report",
				translationKey: "nav.operatingReport",
				icon: BarChart2,
				href: ADMIN_ROUTES.reportsActivity(),
			},
			{ id: "reports_daily", name: "reports_daily", title: "Daily report", translationKey: "nav.dailyReport", icon: Clock, href: ADMIN_ROUTES.reportsDaily() },
			{ id: "reports_employee", name: "reports_employee", title: "Employee report", translationKey: "nav.employeeReport", icon: User, href: ADMIN_ROUTES.reportsEmployee() },
			{ id: "reports_utility", name: "reports_utility", title: "Utility Report", translationKey: "nav.utilityReport", icon: Zap, href: ADMIN_ROUTES.reportsUtility() },
		],
	},
  {
		id: "setting",
		name: "setting",
		title: "Settings",
		translationKey: "nav.settings",
		children: [
			{ id: "setting_theme", name: "setting_theme", title: "Theme", translationKey: "nav.settingTheme", icon: ShoppingBag, href: ADMIN_ROUTES.settingTheme() },
			{ id: "setting_permission", name: "setting_permission", title: "Permission", translationKey: "nav.settingPermission", icon: Settings, href: ADMIN_ROUTES.settingPermissions() },
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
  super_admin: navItems.flatMap((cat) => cat.children?.map((page) => page.id || "") || []),
  admin: [
    "home",
    "orders",
    "products",
    "collections",
    "customers",
    "settings",
    "employee",
    "attendance",
    "payroll",
    "discounts",
    "warehouse",
    "stock_change",
    "produce",
    "utility",
    "utility_usage",
    "invoice",
    "reports_daily",
    "reports_employee",
    "reports_order",
    "reports_stock",
    "reports_customer",
    "reports_activity",
    "reports_utility",
    "reports_production",
  ],
  manager: [
    "home",
    "orders",
    "products",
    "collections",
    "customers",
    "settings",
    "attendance",
    "warehouse",
    "stock_in",
    "stock_out",
    "produce",
    "reports_daily",
    "reports_stock",
    "reports_activity",
		"reports_production",
  ],
  staff: ["home", "orders", "products", "collections", "attendance", "warehouse", "stock_in", "stock_out"],
  customer: ["home", "orders"],
}
