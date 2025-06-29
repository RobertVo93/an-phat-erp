export enum AttendanceShift {
  morning = "morning",
  afternoon = "afternoon",
  evening = "evening"
}

export enum AttendanceStatus {
  present = "present",
  absent = "absent",
  late = "late",
  halfDay = "halfDay",
  overtime = "overtime"
}

export enum PayrollStatus {
  processed = "processed",
  pending = "pending",
  failed = "failed"
}

export enum CollectionStatus {
  active = "active",
  draft = "draft",
  archived = "archived"
}

export enum CollectionCategory {
  fashion = "fashion",
  electronics = "electronics",
  home = "home",
  office = "office"
}

export enum WarehouseStatus {
  active = "active",
  maintenance = "maintenance",
  inactive = "inactive"
}

export enum WarehouseType {
  distributionCenter = "distributionCenter",
  regionalHub = "regionalHub",
  coldStorage = "coldStorage",
  backupStorage = "backupStorage"
}

export enum WarehouseTemperature {
  ambient = "ambient",
  refrigerated = "refrigerated",
  frozen = "frozen"
}

export enum OrderStatus {
  pending = "pending",
  processing = "processing",
  shipped = "shipped",
  delivered = "delivered",
  completed = "completed",
  cancelled = "cancelled"
}

export enum PaymentStatus {
  pending = "pending",
  paid = "paid",
  partial = "partial",
  failed = "failed",
  refunded = "refunded"
}

export enum PaymentMethod {
  creditCard = "creditCard",
  debitCard = "debitCard",
  bankTransfer = "bankTransfer",
  cash = "cash",
  paypal = "paypal"
}

export enum UtilityStatus {
  active = "active",
  inactive = "inactive",
  overdue = "overdue",
  disconnected = "disconnected"
}

export enum UtilityType {
  electricity = "electricity",
  water = "water",
  gas = "gas",
  internet = "internet",
  phone = "phone",
  cable = "cable",
  security = "security",
  cleaning = "cleaning",
  other = "other"
}

export enum UtilityUnit {
  kwh = "kwh",
  m3 = "m3",
  gb = "gb",
  minutes = "minutes"
}

export enum ProductStatus {
  active = "active",
  inactive = "inactive",
  lowStock = "lowStock",
  outOfStock = "outOfStock"
}

export enum CustomerStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending"
}

export enum CustomerType {
  vip = "vip",
  premium = "premium",
  regular = "regular"
}

export enum StockOutDiscountType {
  percentage = "percentage",
  fixed = "fixed"
}

export enum StockOutStatus {
  draft = "draft",
  processing = "processing",
  shipped = "shipped",
  delivered = "delivered",
  cancelled = "cancelled"
}

export enum StockChangeStatus {
  draft = "draft",
  pending = "pending",
  inTransit = "in_transit",
  completed = "completed",
  cancelled = "cancelled"
}

export enum StockChangeType {
  stockIn = "stock-in",
  stockOut = "stock-out",
}

export enum ProductionStatus {
  completed = "completed",
  inProgress = "in-progress",
  paused = "paused",
  cancelled = "cancelled"
}

export enum EmployeeType {
  fullTime = "fullTime",
  partTime = "partTime",
  contract = "contract",
  intern = "intern"
}

export enum EmployeeStatus {
  active = "active",
  inactive = "inactive",
  onLeave = "onLeave"
}

export enum InvoiceStatus {
  draft = "draft",
  sent = "sent",
  paid = "paid",
  partial = "partial",
  overdue = "overdue",
  cancelled = "cancelled"
}

export enum UserRole {
  super_admin = "super_admin",
  admin = "admin",
  manager = "manager",
  staff = "staff",
  customer = "customer",
}

export enum ReadingType {
  predefined_utility = "predefined_utility",
  other = "other"
}