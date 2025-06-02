"use client"

import { useState } from "react"
import type { Order, OrderSearchParams } from "@/types/order"

// Mock data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn An",
    customerEmail: "an.nguyen@email.com",
    customerPhone: "0901234567",
    date: "2024-01-15",
    amount: 2500000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "creditCard",
    items: [
      { id: "1", productId: "P001", productName: "Laptop Dell", quantity: 1, unitPrice: 2500000, total: 2500000 },
    ],
    shippingAddress: "123 Nguyễn Huệ, Q1, TP.HCM",
    notes: "Giao hàng buổi sáng",
    tags: ["urgent"],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị Bình",
    customerEmail: "binh.tran@email.com",
    customerPhone: "0912345678",
    date: "2024-01-14",
    amount: 1500000,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "bankTransfer",
    items: [
      { id: "2", productId: "P002", productName: "Điện thoại iPhone", quantity: 1, unitPrice: 1500000, total: 1500000 },
    ],
    shippingAddress: "456 Lê Lợi, Q3, TP.HCM",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn Cường",
    customerEmail: "cuong.le@email.com",
    customerPhone: "0923456789",
    date: "2024-01-13",
    amount: 3500000,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "cash",
    items: [
      {
        id: "3",
        productId: "P003",
        productName: "Máy tính bảng iPad",
        quantity: 1,
        unitPrice: 3500000,
        total: 3500000,
      },
    ],
    shippingAddress: "789 Võ Văn Tần, Q3, TP.HCM",
    tags: ["fragile"],
    createdAt: "2024-01-13T11:30:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị Dung",
    customerEmail: "dung.pham@email.com",
    customerPhone: "0934567890",
    date: "2024-01-12",
    amount: 1200000,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "creditCard",
    items: [
      { id: "4", productId: "P004", productName: "Tai nghe AirPods", quantity: 2, unitPrice: 600000, total: 1200000 },
    ],
    shippingAddress: "321 Hai Bà Trưng, Q1, TP.HCM",
    notes: "Khách yêu cầu gọi trước khi giao",
    createdAt: "2024-01-12T13:45:00Z",
    updatedAt: "2024-01-12T13:45:00Z",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn Em",
    customerEmail: "em.hoang@email.com",
    customerPhone: "0945678901",
    date: "2024-01-11",
    amount: 4200000,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    items: [
      { id: "5", productId: "P005", productName: "Máy ảnh Canon", quantity: 1, unitPrice: 4200000, total: 4200000 },
    ],
    shippingAddress: "654 Nguyễn Thị Minh Khai, Q3, TP.HCM",
    tags: ["gift", "express"],
    createdAt: "2024-01-11T15:20:00Z",
    updatedAt: "2024-01-11T18:30:00Z",
  },
  {
    id: "ORD-006",
    customer: "Vũ Thị Phương",
    customerEmail: "phuong.vu@email.com",
    customerPhone: "0956789012",
    date: "2024-01-10",
    amount: 800000,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "debitCard",
    items: [
      { id: "6", productId: "P006", productName: "Đồng hồ thông minh", quantity: 1, unitPrice: 800000, total: 800000 },
    ],
    shippingAddress: "987 Cách Mạng Tháng 8, Q10, TP.HCM",
    notes: "Khách hủy do thay đổi ý định",
    createdAt: "2024-01-10T10:10:00Z",
    updatedAt: "2024-01-10T16:25:00Z",
  },
  {
    id: "ORD-007",
    customer: "Đặng Văn Giang",
    customerEmail: "giang.dang@email.com",
    customerPhone: "0967890123",
    date: "2024-01-09",
    amount: 1800000,
    status: "processing",
    paymentStatus: "partial",
    paymentMethod: "bankTransfer",
    items: [
      { id: "7", productId: "P007", productName: "Loa Bluetooth", quantity: 3, unitPrice: 600000, total: 1800000 },
    ],
    shippingAddress: "147 Điện Biên Phủ, Q1, TP.HCM",
    createdAt: "2024-01-09T12:35:00Z",
    updatedAt: "2024-01-09T17:40:00Z",
  },
  {
    id: "ORD-008",
    customer: "Bùi Thị Hoa",
    customerEmail: "hoa.bui@email.com",
    customerPhone: "0978901234",
    date: "2024-01-08",
    amount: 2800000,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "cash",
    items: [
      { id: "8", productId: "P008", productName: "Máy lọc không khí", quantity: 1, unitPrice: 2800000, total: 2800000 },
    ],
    shippingAddress: "258 Pasteur, Q3, TP.HCM",
    tags: ["heavy"],
    createdAt: "2024-01-08T14:50:00Z",
    updatedAt: "2024-01-08T19:15:00Z",
  },
]

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [loading, setLoading] = useState(false)

  const searchAndFilterOrders = (params: OrderSearchParams) => {
    let filteredOrders = [...orders]

    // Search by customer name, email, phone, or order ID
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.customer.toLowerCase().includes(searchLower) ||
          order.customerEmail?.toLowerCase().includes(searchLower) ||
          order.customerPhone?.includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower),
      )
    }

    // Apply filters
    if (params.filters.status) {
      filteredOrders = filteredOrders.filter((order) => order.status === params.filters.status)
    }

    if (params.filters.paymentStatus) {
      filteredOrders = filteredOrders.filter((order) => order.paymentStatus === params.filters.paymentStatus)
    }

    if (params.filters.paymentMethod) {
      filteredOrders = filteredOrders.filter((order) => order.paymentMethod === params.filters.paymentMethod)
    }

    if (params.filters.dateFrom) {
      filteredOrders = filteredOrders.filter((order) => order.date >= params.filters.dateFrom!)
    }

    if (params.filters.dateTo) {
      filteredOrders = filteredOrders.filter((order) => order.date <= params.filters.dateTo!)
    }

    if (params.filters.amountMin !== undefined) {
      filteredOrders = filteredOrders.filter((order) => order.amount >= params.filters.amountMin!)
    }

    if (params.filters.amountMax !== undefined) {
      filteredOrders = filteredOrders.filter((order) => order.amount <= params.filters.amountMax!)
    }

    if (params.filters.customer) {
      const customerLower = params.filters.customer.toLowerCase()
      filteredOrders = filteredOrders.filter((order) => order.customer.toLowerCase().includes(customerLower))
    }

    // Sort
    filteredOrders.sort((a, b) => {
      let aValue: any, bValue: any

      switch (params.sortBy) {
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "customer":
          aValue = a.customer.toLowerCase()
          bValue = b.customer.toLowerCase()
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
        customer: orderData.customer || "",
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        date: new Date().toISOString().split("T")[0],
        amount: orderData.amount || 0,
        status: orderData.status || "pending",
        paymentStatus: orderData.paymentStatus || "pending",
        paymentMethod: orderData.paymentMethod || "cash",
        items: orderData.items || [],
        shippingAddress: orderData.shippingAddress,
        notes: orderData.notes,
        tags: orderData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setOrders((prev) => [newOrder, ...prev])
      return newOrder
    } finally {
      setLoading(false)
    }
  }

  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    setLoading(true)
    try {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, ...orderData, updatedAt: new Date().toISOString() } : order,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const deleteOrder = async (id: string) => {
    setLoading(true)
    try {
      setOrders((prev) => prev.filter((order) => order.id !== id))
    } finally {
      setLoading(false)
    }
  }

  return {
    orders,
    loading,
    searchAndFilterOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  }
}
