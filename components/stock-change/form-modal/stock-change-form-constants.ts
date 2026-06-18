import { getRecentTimeIntervalSlot } from "@/lib/utils"
import { StockChange, StockChangeStatus, StockChangeType } from "@/types"

export const DEFAULT_STOCK_CHANGE: StockChange = {
  number: "",
  type: StockChangeType.stockIn,
  date: getRecentTimeIntervalSlot(15),
  supplier: "",
  subtotal: 0,
  tax: 0,
  discount: 0,
  totalAmount: 0,
  status: StockChangeStatus.draft,
  notes: "",
  stockProducts: [],
  receivedBy: "",
}
