"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"
import { getProductById } from "@/lib/httpclient"
import { ITransferProduct, Warehouse, WarehouseProduct, WarehouseStatus } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { getWarehouses, transferWarehouse } from "@/lib/httpclient/warehouse.client"
import { useLanguage } from "@/contexts/language-context"

export function useProduct(productId: string) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const [product, setProduct] = useState<Product>()
  const [sourceWHP, setSourceWHP] = useState<WarehouseProduct>()
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      const res = await getProductById(productId) as Product
      setProduct(res)
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotLoad"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onOpenTransferModal = (warehouse: WarehouseProduct) => {
    setSourceWHP(warehouse)
    setIsTransferModalOpen(true)
  }

  const onCloseTransferModal = () => {
    setIsTransferModalOpen(false)
    setSourceWHP(undefined)
  }

  const onSubmitTransfer = async (data: ITransferProduct) => {
    try {
      setLoading(true)
      await transferWarehouse({
        sourceWarehouseId: data.sourceWH?.id!,
        destinationWarehouseId: data.destinationWH?.id!,
        productId: data.product?.id!,
        quantity: data.quantity!,
      })
      await fetchProduct(productId)
      setIsTransferModalOpen(false)
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotOperate"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct(productId)
  }, [productId])

  useEffect(() => {
    const onInit = async () => {
      const res = await getWarehouses({ status: WarehouseStatus.active })
      setWarehouses(res.data)
    }
    onInit()
  }, [])

  return {
    loading,
    product,
    isOpen: isTransferModalOpen,
    sourceWH: sourceWHP?.warehouse!,
    availableQuantity: sourceWHP?.quantity!,
    warehouses,
    onOpen: onOpenTransferModal,
    onClose: onCloseTransferModal,
    onSubmit: onSubmitTransfer,
  }
}
