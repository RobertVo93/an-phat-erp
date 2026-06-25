import { useMemo, useState } from "react"
import { Customer } from "@/types/customer"
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

    const addProduct = () => {
        setOrderItems([...orderItems, {}])
    }

    const updateProduct = (index: number, field: "id" | "quantity" | "unitCost", value: string | number) => {
        const updatedItems = [...orderItems]
        if (field === "id") {
            const warehouseProducts = groupWarehouseProductsByProduct(orderData.warehouse?.warehouseProducts || [])
            const productSummary = warehouseProducts.find((item) => item.product?.id === value)
            if (productSummary) {
                updatedItems[index] = {
                    ...updatedItems[index],
                    id: productSummary.product.id,
                    name: productSummary.product.name,
                    number: productSummary.product.sku,
                    unit: productSummary.product.unit,
                    quantity: 1,
                    unitCost: productSummary.product.cost,
                    totalCost: productSummary.product.cost,
                    product: productSummary.product,
                }
            }
        } else if (field === "quantity") {
            updatedItems[index].quantity = Number.parseFloat(String(value)) || 0
            updatedItems[index].totalCost = updatedItems[index].quantity! * (updatedItems[index].unitCost ?? 0)
        } else {
            updatedItems[index].unitCost = Number.parseFloat(String(value)) || 0
            updatedItems[index].totalCost = (updatedItems[index].quantity ?? 0) * updatedItems[index].unitCost!
        }
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
        updateProduct,
        removeItem,
        handleSubmit,
    }
}
