"use client"

import { useEffect, useState } from "react"
import type { Order, OrderSearchParams } from "@/types/order"
import { Customer } from "@/types/customer"
import { getCustomers } from "@/lib/httpclient/customer.client"
import { CustomerStatus, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { createOrder as apiCreateOrder, getOrders } from "@/lib/httpclient/order.client"
import { Warehouse } from "@/types"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([])

  const onInit = async () => {
    try {
      setLoading(true)
      const orderResponse = await getOrders()
      setOrders(orderResponse.data)

      const cus = await getCustomers()
      const activeCustomers = (cus.data as Customer[]).filter((customer) => customer.status === CustomerStatus.active)
      setAllCustomers(activeCustomers);

      const wh = await getWarehouses()
      setAllWarehouses(wh.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const searchAndFilterOrders = (params: OrderSearchParams) => {
    let filteredOrders = [...orders]

    // Search by customer name, email, phone, or order ID
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.customer!.name!.toLowerCase().includes(searchLower) ||
          order.customer!.email!.toLowerCase().includes(searchLower) ||
          order.customer!.phone!.includes(searchLower) ||
          order.id!.toLowerCase().includes(searchLower),
      )
    }

    // Apply filters
    if (params.filters.status && params.filters.status !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.status === params.filters.status)
    }

    if (params.filters.paymentStatus && params.filters.paymentStatus !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.paymentStatus === params.filters.paymentStatus)
    }

    if (params.filters.paymentMethod && params.filters.paymentMethod !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.paymentMethod === params.filters.paymentMethod)
    }

    if (params.filters.dateFrom) {
      filteredOrders = filteredOrders.filter((order) => order.deliveryDate!.toISOString() >= params.filters.dateFrom!)
    }

    if (params.filters.dateTo) {
      filteredOrders = filteredOrders.filter((order) => order.deliveryDate!.toISOString() <= params.filters.dateTo!)
    }

    if (params.filters.amountMin !== undefined) {
      filteredOrders = filteredOrders.filter((order) => order.totalAmount! >= params.filters.amountMin!)
    }

    if (params.filters.amountMax !== undefined) {
      filteredOrders = filteredOrders.filter((order) => order.totalAmount! <= params.filters.amountMax!)
    }

    if (params.filters.customer) {
      const customerLower = params.filters.customer.toLowerCase()
      filteredOrders = filteredOrders.filter((order) => order.customer!.name!.toLowerCase().includes(customerLower))
    }

    // Sort
    filteredOrders.sort((a, b) => {
      let aValue: any, bValue: any

      switch (params.sortBy) {
        case "date":
          aValue = new Date(a.deliveryDate!)
          bValue = new Date(b.deliveryDate!)
          break
        case "amount":
          aValue = a.totalAmount
          bValue = b.totalAmount
          break
        case "customer":
          aValue = a.customer?.name?.toLowerCase() ?? ""
          bValue = b.customer?.name?.toLowerCase() ?? ""
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return params.sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return params.sortOrder === "asc" ? 1 : -1
      return 0
    })

    // Pagination
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    return {
      orders: paginatedOrders,
      total: filteredOrders.length,
      totalPages: Math.ceil(filteredOrders.length / params.limit),
    }
  }

  const createOrder = async (orderData: Partial<Order>) => {
    setLoading(true)
    try {
      const newOrder: Order = {
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        deliveryDate: orderData.deliveryDate,
        totalAmount: orderData.totalAmount || 0,
        status: orderData.status || OrderStatus.pending,
        paymentStatus: orderData.paymentStatus || PaymentStatus.pending,
        paymentMethod: orderData.paymentMethod || PaymentMethod.cash,
        items: orderData.items || [],
        customer: orderData.customer,
        shippingAddress: orderData.shippingAddress,
        notes: orderData.notes,
        tags: orderData.tags,
        shippingFee: orderData.shippingFee,
        tax: orderData.tax,
        warehouse: orderData.warehouse ? {
          ...orderData.warehouse,
          warehouseProducts: orderData.warehouse.warehouseProducts
            ? [...orderData.warehouse.warehouseProducts.map(wp => ({ ...wp }))]
            : []
        } : undefined
      }


      const { createdOrder, updatedOrders } = await apiCreateOrder(newOrder)

      // change warehouse stock
      for (const item of newOrder.items!) {
        const productId = item.product?.id
        const quantityToDeduct = item.quantity ?? 0
        if (!productId || quantityToDeduct <= 0) continue

        const targetWP = newOrder.warehouse?.warehouseProducts?.find(
          wp => wp.product?.id === productId && (wp.quantity ?? 0) >= quantityToDeduct
        )

        if (targetWP) {
          targetWP.quantity! -= quantityToDeduct
        }
      }

      // update orders
      const affectedOrderIds = new Set<string>([
        createdOrder.id,
        ...(updatedOrders || []).map((o: Order) => o.id),
      ])

      setOrders(prev => {
        const filtered = prev.filter(order => !affectedOrderIds.has(order.id!))
        return [createdOrder, ...(updatedOrders || []), ...filtered]
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onInit()
  }, [])

  return {
    orders,
    loading,
    searchAndFilterOrders,
    createOrder,
    allCustomers,
    allWarehouses,
  }
}
