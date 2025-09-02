import { Customer } from "./customer";
import { OrderStatus, PaymentMethod } from "./enums";

export interface IReportOrder {
  number?: string
  customer?: Customer
  deliveryAddress?: string
  status?: OrderStatus
  deliveryDate?: Date
  tag?: string
  paymentMethod?: PaymentMethod
  note?: string
  totalPrice?: number
  orderDate?: Date
}

export interface ReportOrderFilter {
  customers?: Customer[]
  status?: OrderStatus
  paymentMethod?: PaymentMethod 
  dateFrom: Date
  dateTo: Date
}