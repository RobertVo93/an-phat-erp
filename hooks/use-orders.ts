"use client"

import { useEffect, useState } from "react"
import type { Order, OrderSearchParams } from "@/types/order"
import { Customer } from "@/types/customer"
import { Product } from "@/types/product"
import { getCustomers } from "@/lib/httpclient/customer.client"
import { getProducts } from "@/lib/httpclient/product.client"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { createOrder as apiCreateOrder, getOrders } from "@/lib/httpclient/order.client"

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])

  const getCustomersAndProducts = async () => {
    try {
      setLoading(true)
      const cus = await getCustomers()
      setAllCustomers(cus.data);

      const pro = await getProducts()
      setAllProducts(pro.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getAllOrders = async () => {
    try {
      setLoading(true)
      const res = await getOrders()
      setOrders(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllOrders()
  }, [])

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
        orderNumber: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        deliveryDate: new Date(),
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
      }
      const created = await apiCreateOrder(newOrder)
      setOrders((prev) => [created, ...prev])
    } finally {
      setLoading(false)
    }
  }


  return {
    orders,
    loading,
    searchAndFilterOrders,
    createOrder,
    allCustomers,
    allProducts,
    getCustomersAndProducts
  }
}
