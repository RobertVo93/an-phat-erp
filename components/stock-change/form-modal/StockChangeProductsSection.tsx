"use client"

import { Plus, Package, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { IStockChangeProductsSectionProps } from "./stock-change-form-types"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { FormattedCurrency } from "@/components/ui/formatted-currency"

export function StockChangeProductsSection({
  stockProducts,
  products,
  errors,
  onAddProduct,
  onUpdateItem,
  onRemoveItem,
}: IStockChangeProductsSectionProps) {
  const { t } = useLanguage()

  return (
    <Card className="overflow-hidden border-dashed">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" />
            {t("stockIn.products")}
          </CardTitle>
          <Button onClick={onAddProduct} size="sm" type="button">
            <Plus className="mr-2 h-4 w-4" />
            {t("stockIn.form.addProduct")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {errors.items && <p className="mb-4 text-sm text-red-500">{errors.items}</p>}

        <div className="space-y-4">
          {stockProducts.map((item, index) => {
            const selectedProductIds = stockProducts
              .map((stockProduct) => stockProduct.id)
              .filter((id): id is string => Boolean(id))

            return (
              <div key={`${item.id || "new"}-${index}`} className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                  <div className="md:col-span-2">
                    <Label>{t("stockIn.form.selectProduct")}</Label>
                    <Select value={item.id || ""} onValueChange={(value) => onUpdateItem(index, "id", value)}>
                      <SelectTrigger className={errors[`item_${index}_product`] ? "border-red-500" : ""}>
                        <SelectValue placeholder={t("stockIn.form.selectProduct")} />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => {
                          if (!product.id) return null

                          const isSelectedByAnotherRow = selectedProductIds.includes(product.id) && product.id !== item.id

                          return (
                            <SelectItem
                              key={product.id}
                              value={product.id}
                              className={isSelectedByAnotherRow ? "hidden" : "font-medium"}
                            >
                              {product.name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {errors[`item_${index}_product`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`item_${index}_product`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-1`">
                    <Label>{t("stockIn.form.quantity")}</Label>
                    <QuantitySelector
                      quantity={item.quantity ?? 0}
                      showAction={false}
                      onQuantityChange={(newValue) => onUpdateItem(index, "quantity", newValue)}
                      className={errors[`item_${index}_quantity`] ? "border-red-500" : ""}
                      inputClassName="text-right"
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <Label>{t("stockIn.form.unitCost")}</Label>
                    <QuantitySelector
                      quantity={item.unitCost ?? 0}
                      showAction={false}
                      onQuantityChange={(newValue) => onUpdateItem(index, "unitCost", newValue)}
                      className={errors[`item_${index}_unitCost`] ? "border-red-500" : ""}
                      inputClassName="text-right"
                    />
                    {errors[`item_${index}_unitCost`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`item_${index}_unitCost`]}</p>
                    )}
                  </div>

                  <div className="flex justify-between gap-3 md:col-span-2">
                    <div>
                      <Label>{t("stockIn.form.totalCost")}</Label>
                      <FormattedCurrency
                          as="div"
                          value={(item.quantity || 0) * (item.unitCost || 0)}
                          className="text-lg font-semibold md:mt-[8px]"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
