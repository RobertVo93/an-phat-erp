import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ADMIN_ROUTES } from "@/constants/nav"
import React from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export const ProductDetailHeader = () => {
  const { t } = useLanguage()
  return (
    <div className="space-y-4 flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">{t("products.detail.productDetail")}</h2>
      <div className="flex items-center justify-between">
        <Link href={ADMIN_ROUTES.products()}>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("products.detail.backToProducts")}</span>
            <span className="sm:hidden">{t("products.detail.backToProducts")}</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
