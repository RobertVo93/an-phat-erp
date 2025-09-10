"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Users, Package, Factory } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface QuickActionsProps {
  onCreateOrder: () => void
  onCreateCustomer: () => void
  onCreateProduct: () => void
  onCreateProduction: () => void
}

export function QuickActions({ onCreateOrder, onCreateCustomer, onCreateProduct, onCreateProduction }: QuickActionsProps) {
  const { t } = useLanguage()
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("dashboard.quickActions")}</CardTitle>
        <CardDescription>Frequently used actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start" variant="outline" onClick={onCreateOrder}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("dashboard.createOrder")}
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={onCreateProduct}>
          <Package className="mr-2 h-4 w-4" />
          {t("dashboard.addProduct")}
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={onCreateCustomer}>
          <Users className="mr-2 h-4 w-4" />
          {t("dashboard.addCustomer")}
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={onCreateProduction}>
          <Factory className="mr-2 h-4 w-4" />
          {t("production.createNewProduction")}
        </Button>
      </CardContent>
    </Card>
  )
}


