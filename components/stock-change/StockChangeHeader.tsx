import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export interface StockChangeHeaderProps {
  onNewStockIn: () => void;
}

export const StockChangeHeader: React.FC<StockChangeHeaderProps> = ({ onNewStockIn }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("stockIn.title")}</h2>
        <p className="text-muted-foreground">{t("stockIn.description")}</p>
      </div>
      <Button onClick={onNewStockIn}>
        <Plus className="mr-2 h-4 w-4" />
        {t("stockIn.newStockIn")}
      </Button>
    </div>
  );
};
