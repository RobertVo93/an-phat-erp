import { useMemo, useState } from "react"
import { Customer } from "@/types/customer"
import { Product } from "@/types/product"
import { Order, IOrderItem } from "@/types/order"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { groupWarehouseProductsByProduct, getNextBlockTime } from "@/lib/utils"
import { env } from "@/constants/env"

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

export function useNewOrder(createOrder: (orderData: Partial<Order>) => void) {
    const [orderData, setOrderData] = useState<Order>({...defaultOrderData, deliveryDate: getNextBlockTime(new Date())})
    const [orderItems, setOrderItems] = useState<IOrderItem[]>([])
    const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.totalCost!, 0), [orderItems])
    const tax = useMemo(() => subtotal * env.NEXT_PUBLIC_TAX_RATE, [subtotal])
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
        const newItem: IOrderItem = {
            id: product.id,
            name: product.name,
            number: product.sku,
            quantity: 1,
            unitCost: product.price,
            totalCost: product.price,
            unit: product.unit,
        }
        setOrderItems([...orderItems, newItem])
    }

    const updateQuantity = (index: number, quantity: number, stock: number) => {
        if (quantity <= 0 || quantity > stock) return
        const updatedItems = [...orderItems]
        updatedItems[index].quantity = quantity
        updatedItems[index].totalCost = quantity * updatedItems[index].unitCost!
        setOrderItems(updatedItems)
    }

    const updatePrice = (index: number, price: number) => {
        if (price < 0) return
        const updatedItems = [...orderItems]
        updatedItems[index].unitCost = price
        updatedItems[index].totalCost = updatedItems[index].quantity! * price
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
        setOrderData({...defaultOrderData, deliveryDate: getNextBlockTime(new Date())})
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
