import { CustomerStatus, CustomerType } from "@/types"

export const translateCustomerStatus = (
  status: string,
  t: (key: string) => string
) => {
  switch (status) {
    case CustomerStatus.active:
      return t("customers.status.active")
    case CustomerStatus.inactive:
      return t("customers.status.inactive")
    case CustomerStatus.pending:
      return t("customers.status.pending")
    default:
      return status
  }
}

export const translateCustomerType = (
  type: string,
  t: (key: string) => string
) => {
  switch (type) {
    case CustomerType.vip:
      return t("customers.type.vip")
    case CustomerType.premium:
      return t("customers.type.premium")
    case CustomerType.regular:
      return t("customers.type.regular")
    default:
      return type
  }
}