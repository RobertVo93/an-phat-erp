import { useEffect, useMemo, useState } from "react"
import { Customer } from "@/types/customer"
import { Order, IOrderItem } from "@/types/order"
import { groupWarehouseProductsByProduct } from "@/lib/utils"
import { env } from "@/constants/env"
import { getProductPriceByQuantity } from "@/lib/product-pricing"

export function useEditOrder(order: Order, onUpdate: (orderData: Partial<Order>) => void) {
    const [orderData, setOrderData] = useState<Order>(order)
    const [orderItems, setOrderItems] = useState<IOrderItem[]>(order.items || [])
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
        const newItem: IOrderItem = {}
        setOrderItems([...orderItems, newItem])
    }

    const updateProduct = (index: number, field: "id" | "quantity" | "unitCost", value: string | number) => {
        const updated = [...(orderItems || [])]
        if (field === "id") {
            const warehouseProducts = groupWarehouseProductsByProduct(orderData.warehouse?.warehouseProducts || [])
            const productSummary = warehouseProducts.find((m) => m.product?.id === value)
            if (productSummary) {
                updated[index] = {
                    ...updated[index],
                    quantity: 1,
                    id: productSummary.product.id,
                    totalCost: productSummary.product.cost,
                    name: productSummary.product.name,
                    unit: productSummary.product.unit,
                    number: productSummary.product.sku,
                    unitCost: productSummary.product.cost,
                    product: productSummary.product,
                }
            }
        } else if (field === "quantity") {
            const quantity = Number.parseFloat(String(value)) || 0
            const product = groupWarehouseProductsByProduct(orderData.warehouse?.warehouseProducts!)
            .find((wp) => wp.product.id === updated[index].id)?.product
            const unitCost = getProductPriceByQuantity(product!, Number.parseFloat(String(value)) || 0)
            updated[index].quantity = quantity
            updated[index].unitCost = unitCost
            updated[index].totalCost = quantity * unitCost
        }
        else if (field === "unitCost") {
            updated[index].unitCost = Number.parseFloat(String(value)) || 0
            updated[index].totalCost = updated[index].quantity! * updated[index].unitCost!
        }
        setOrderItems(updated)
    }

    const removeItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index))
    }

    const handleSubmit = (onOpenChange: (open: boolean) => void) => {
        onUpdate({
            ...orderData,
            items: orderItems,
            totalAmount: total,
            shippingFee: shipping,
            tax: tax
        })
        onOpenChange(false)
    }

    useEffect(() => {
        setOrderData(order)
        setOrderItems(order.items || [])
    }, [order])

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
