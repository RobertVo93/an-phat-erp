import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, CheckCircle, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { formatLargeCurrency } from "@/lib/utils";

interface StockChangeStatisticsProps {
  totalReceipts: number;
  totalValue: number;
  completedRecords: number;
  pendingRecords: number;
}

export const StockChangeStatistics: React.FC<StockChangeStatisticsProps> = ({
  totalReceipts,
  totalValue,
  completedRecords,
  pendingRecords,
}) => {
  const { t } = useLanguage();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stockIn.totalReceipts")}</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReceipts}</div>
          <p className="text-xs text-muted-foreground">{t("stockIn.thisMonth")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stockIn.totalValue")}</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLargeCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">{t("stockIn.inventory")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stockIn.completed")}</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedRecords}</div>
          <p className="text-xs text-muted-foreground">{t("stockIn.receivedSuccess")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stockIn.pending")}</CardTitle>
          <Calendar className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRecords}</div>
          <p className="text-xs text-muted-foreground">{t("stockIn.waitForDelivery")}</p>
        </CardContent>
      </Card>
    </div>
  );
};
