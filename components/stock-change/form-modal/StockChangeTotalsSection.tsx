"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { env } from "@/constants/env"
import { IStockChangeTotalsSectionProps } from "./stock-change-form-types"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { FormattedCurrency } from "@/components/ui/formatted-currency"

export function StockChangeTotalsSection({ formData, setFormData }: IStockChangeTotalsSectionProps) {
  const { t } = useLanguage()

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{t("stockIn.form.subtotal")}:</span>
            <FormattedCurrency as="span" className="font-semibold" value={formData.subtotal}/>
          </div>

          {env.NEXT_PUBLIC_TAX_RATE > 0 && (
            <div className="flex justify-between text-sm">
              <span>{t("stockIn.form.tax")} ({env.NEXT_PUBLIC_TAX_RATE}%):</span>
              <FormattedCurrency as="span" className="font-semibold" value={formData.tax}/>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 text-sm">
            <span>{t("stockIn.form.discount")}:</span>
            <QuantitySelector
              quantity={formData.discount ?? 0}
              min={0}
              showAction={false}
              onQuantityChange={(newValue) => setFormData((prev) => ({ ...prev, discount: newValue }))}
              className="w-32"
              inputClassName="text-right"
            />
          </div>

          <div className="flex justify-between border-t border-slate-700 pt-4 text-lg font-bold">
            <span>{t("stockIn.totalAmount")}:</span>
            <FormattedCurrency as="span" value={formData.totalAmount}/>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
