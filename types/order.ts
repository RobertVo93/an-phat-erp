import { OrderStatus, PaymentStatus, PaymentMethod } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { Customer as ICustomer } from "./customer";
import { Product as IProduct } from "./product";
import { Warehouse as IWarehouse } from "./warehouse";

export interface Order extends IBase {
  orderNumber?: string
  deliveryDate?: Date
  totalAmount?: number
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  paymentMethod?: PaymentMethod
  shippingAddress?: string
  notes?: string
  tags?: string[]
  tax?: number
  shippingFee?: number

  items?: OrderItem[]
  customer?: ICustomer
  warehouse?: IWarehouse
}

export interface OrderItem extends IBase {
  quantity?: number
  unitPrice?: number
  total?: number

  product?: IProduct
  order?: Order
}

export interface OrderFilters extends IBaseFilters{
  searchTerm?: string
  status?: string
  paymentStatus?: string
  paymentMethod?: string
  dateFrom?: string
  dateTo?: string
  totalAmountFrom?: number
  totalAmountTo?: number
  customer?: string
}

export type OrderSortBy = "deliveryDate" | "totalAmount" | "customer" | "orderNumber"
