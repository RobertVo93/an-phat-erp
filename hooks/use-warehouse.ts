import { useLanguage } from "@/contexts/language-context"
import { getWarehouseById, getWarehouses, transferWarehouse } from "@/lib/httpclient/warehouse.client"
import { toast } from "@/components/ui/use-toast"
import { ITransferProduct, Product, Warehouse, WarehouseStatus } from "@/types"
import { useEffect, useState } from "react"

export function useWarehouse(warehouseId: string) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [warehouseData, setWarehouseData] = useState<Warehouse>()
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product>()

  const fetchWarehouse = async (id: string) => {
    try {
      setLoading(true)
      const res = await getWarehouseById(id)
      setWarehouseData(res)
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

  const onOpenTransferModal = (product: Product) => {
    setSelectedProduct(product)
    setIsTransferModalOpen(true)
  }

  const onCloseTransferModal = () => {
    setIsTransferModalOpen(false)
    setSelectedProduct(undefined)
  }

  const decreaseProductQuantity = (productId: string, quantity: number) => {
    setWarehouseData(prev =>
      prev
        ? {
          ...prev,
          warehouseProducts: prev.warehouseProducts
            ?.map(wp =>
              wp.product?.id === productId
                ? { ...wp, quantity: (wp.quantity || 0) - quantity }
                : wp
            )
            .filter(wp => (wp.quantity ?? 0) > 0),
        }
        : prev
    )
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
      setIsTransferModalOpen(false)
      fetchWarehouse(warehouseId)
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
    if (warehouseId) {
      fetchWarehouse(warehouseId)
    }
  }, [warehouseId])

  useEffect(() => {
    const onInit = async () => {
      const res = await getWarehouses({ status: WarehouseStatus.active })
      setWarehouses(res.data)
    }
    onInit()
  }, [])

  return {
    loading,
    warehouse: warehouseData,
    warehouses,
    isTransferModalOpen,
    selectedProduct,

    onOpenTransferModal,
    onCloseTransferModal,
    onSubmitTransfer,
    setIsTransferModalOpen,
  }
}
