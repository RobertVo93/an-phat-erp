import { useMemo, useState } from "react"
import { Customer } from "@/types/customer"
import { Product } from "@/types/product"
import { Order, OrderItem } from "@/types/order"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { groupWarehouseProductsByProduct } from "@/lib/utils"

const defaultOrderData: Partial<Order> = {
    customer: undefined,
    deliveryDate: new Date(),
    totalAmount: 0,
    status: OrderStatus.pending,
    paymentStatus: PaymentStatus.pending,
    paymentMethod: PaymentMethod.cash,
    shippingAddress: "",
    items: [],
    notes: "",
    tags: [],
    warehouse: undefined
}

export function useNewOrderModal(createOrder: (orderData: Partial<Order>) => void) {
    const [orderData, setOrderData] = useState<Order>(defaultOrderData)
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.total!, 0), [orderItems])
    const tax = useMemo(() => subtotal * 0.1, [subtotal])
    const shipping = useMemo(() => subtotal > 100 ? 0 : 15, [subtotal])
    const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping])

    const onCustomerselect = (customer: Customer | undefined) => {
        setOrderData({
            ...orderData,
            customer,
            shippingAddress: customer?.location || "",
        })
    }

    const addProduct = (product: Product) => {
        const newItem: OrderItem = {
            product,
            quantity: 1,
            unitPrice: product.price,
            total: product.price,
        }
        setOrderItems([...orderItems, newItem])
    }

    const updateQuantity = (index: number, quantity: number, stock: number) => {
        if (quantity <= 0 || quantity > stock) return
        const updatedItems = [...orderItems]
        updatedItems[index].quantity = quantity
        updatedItems[index].total = quantity * updatedItems[index].unitPrice!
        setOrderItems(updatedItems)
    }

    const updatePrice = (index: number, price: number) => {
        if (price < 0) return
        const updatedItems = [...orderItems]
        updatedItems[index].unitPrice = price
        updatedItems[index].total = updatedItems[index].quantity! * price
        setOrderItems(updatedItems)
    }

    const removeItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index))
    }

    const handleSubmit = (onOpenChange: (open: boolean) => void) => {
        createOrder({
            ...orderData,
            items: orderItems,
            totalAmount: total,
            shippingFee: shipping,
            tax: tax
        })
        setOrderData(defaultOrderData)
        setOrderItems([])
        onOpenChange(false)
    }

    const getWarehouseProductTotal = (productId: string) => {
        return groupWarehouseProductsByProduct(orderData.warehouse?.warehouseProducts!)
            .find((wp) => (wp.product.id === productId))?.totalQuantity || 0
    }

    return {
        orderData,
        orderItems,
        subtotal,
        tax,
        shipping,
        total,
        setOrderData,
        setOrderItems,
        onCustomerselect,
        addProduct,
        updateQuantity,
        updatePrice,
        removeItem,
        handleSubmit,
        getWarehouseProductTotal,
    }
}
