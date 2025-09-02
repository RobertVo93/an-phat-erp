import {
  ProductStatus,
  CustomerStatus,
  CustomerType,
  EmployeeStatus,
  EmployeeType,
  OrderStatus,
  PaymentStatus,
  WarehouseStatus,
  ProductionStatus,
  AttendanceStatus,
  AttendanceSubStatus,
  PayrollStatus,
  UtilityStatus,
  InvoiceStatus,
  AttendanceShift,
  StockChangeStatus,
} from "@/types/enums"

export const getProductStatusColor = (status: string) => {
  switch (status) {
    case ProductStatus.active:
      return "bg-green-100 text-green-800"
    case ProductStatus.inactive:
      return "bg-gray-100 text-gray-800"
    case ProductStatus.lowStock:
      return "bg-yellow-100 text-yellow-800"
    case ProductStatus.outOfStock:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getCustomerStatusColor = (status: string) => {
  switch (status) {
    case CustomerStatus.active:
      return "bg-green-100 text-green-800"
    case CustomerStatus.inactive:
      return "bg-red-100 text-red-800"
    case CustomerStatus.pending:
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getCustomerTypeColor = (type: string) => {
  switch (type) {
    case CustomerType.vip:
      return "bg-purple-100 text-purple-800"
    case CustomerType.premium:
      return "bg-blue-100 text-blue-800"
    case CustomerType.regular:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getEmployeeStatusColor = (status: string) => {
  switch (status) {
    case EmployeeStatus.active:
      return "bg-green-100 text-green-800"
    case EmployeeStatus.onLeave:
      return "bg-yellow-100 text-yellow-800"
    case EmployeeStatus.inactive:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getEmployeeTypeColor = (type: string) => {
  switch (type) {
    case EmployeeType.fullTime:
      return "bg-blue-100 text-blue-800"
    case EmployeeType.partTime:
      return "bg-purple-100 text-purple-800"
    case EmployeeType.contract:
      return "bg-orange-100 text-orange-800"
    case EmployeeType.intern:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.completed:
      return "bg-green-100 text-green-800"
    case OrderStatus.processing:
      return "bg-yellow-100 text-yellow-800"
    case OrderStatus.shipped:
      return "bg-blue-100 text-blue-800"
    case OrderStatus.delivered:
      return "bg-purple-100 text-purple-800"
    case OrderStatus.pending:
      return "bg-gray-100 text-gray-800"
    case OrderStatus.cancelled:
      return "bg-red-100 text-red-800"
    case OrderStatus.lackProduct:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case PaymentStatus.paid:
      return "bg-green-100 text-green-800"
    case PaymentStatus.pending:
      return "bg-yellow-100 text-yellow-800"
    case PaymentStatus.failed:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getWarehouseStatusColor = (status: string) => {
  switch (status) {
    case WarehouseStatus.active:
      return "bg-green-100 text-green-800"
    case WarehouseStatus.maintenance:
      return "bg-yellow-100 text-yellow-800"
    case WarehouseStatus.inactive:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStockChangeStatusColor = (status: string): string => {
  switch (status) {
    case StockChangeStatus.completed:
      return "bg-green-100 text-green-800";
    case StockChangeStatus.pending:
      return "bg-yellow-100 text-yellow-800";
    case StockChangeStatus.inTransit:
      return "bg-blue-100 text-blue-800";
    case StockChangeStatus.cancelled:
      return "bg-red-100 text-red-800";
    case StockChangeStatus.draft:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getProductionStatusColor = (status: ProductionStatus) => {
  switch (status) {
    case ProductionStatus.completed:
      return "bg-green-100 text-green-800"
    case ProductionStatus.inProgress:
      return "bg-blue-100 text-blue-800"
    case ProductionStatus.cancelled:
      return "bg-red-100 text-red-800"
    case ProductionStatus.lackMaterial:
      return "bg-red-100 text-red-800"
    case ProductionStatus.paused:
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getAttendanceStatusColor = (status: string) => {
  switch (status) {
    case AttendanceStatus.completed: return "bg-green-100 text-green-800"
    case AttendanceStatus.draft: return "bg-gray-100 text-gray-800"
    case AttendanceStatus.waitingApproval: return "bg-yellow-100 text-yellow-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export const getAttendanceSubStatusColor = (subStatus: string) => {
  switch (subStatus) {
    case AttendanceSubStatus.present: return "bg-green-100 text-green-800"
    case AttendanceSubStatus.late: return "bg-yellow-100 text-yellow-800"
    case AttendanceSubStatus.absent: return "bg-red-100 text-red-800"
    case AttendanceSubStatus.leave: return "bg-blue-100 text-blue-800"
    case AttendanceSubStatus.overtime: return "bg-purple-100 text-purple-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export const getAttendanceShiftColor = (shift: string) => {
  switch (shift) {
    case AttendanceShift.morning: return "bg-orange-100 text-orange-800"
    case AttendanceShift.afternoon: return "bg-blue-100 text-blue-800"
    case AttendanceShift.evening: return "bg-indigo-100 text-indigo-800"
    case AttendanceShift.all: return "bg-gray-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export const getPayrollStatusColor = (status: string) => {
  switch (status) {
    case PayrollStatus.draft:
      return "bg-orange-100 text-orange-800"
    case PayrollStatus.processing:
      return "bg-blue-100 text-blue-800"
    case PayrollStatus.processed:
      return "bg-green-100 text-green-800"
    case PayrollStatus.pending:
      return "bg-yellow-100 text-yellow-800"
    case PayrollStatus.failed:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getUtilityStatusColor = (status: string) => {
  switch (status) {
    case UtilityStatus.draft:
      return "bg-blue-100 text-blue-800"
    case UtilityStatus.active:
      return "bg-green-100 text-green-800"
    case UtilityStatus.overdue:
      return "bg-red-100 text-red-800"
    case UtilityStatus.inactive:
      return "bg-yellow-100 text-yellow-800"
    case UtilityStatus.disconnected:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getInvoiceStatusColor = (status: string) => {
  switch (status) {
    case InvoiceStatus.draft:
      return "bg-orange-100 text-orange-800"
    case InvoiceStatus.paid:
      return "bg-green-100 text-green-800"
    case InvoiceStatus.sent:
      return "bg-blue-100 text-blue-800"
    case InvoiceStatus.overdue:
      return "bg-red-100 text-red-800"
    case InvoiceStatus.cancelled:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}