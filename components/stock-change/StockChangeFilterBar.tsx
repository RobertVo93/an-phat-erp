import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { StockChangeSortBy } from "@/types/stock-change";

export interface StockChangeFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onShowFilter: () => void;
  sortBy: StockChangeSortBy;
  sortOrder: "asc" | "desc";
  onSort: (field: StockChangeSortBy) => void;
}

export const StockChangeFilterBar: React.FC<StockChangeFilterBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onShowFilter,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("stockIn.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onShowFilter}>
          <Filter className="mr-2 h-4 w-4" />
          {t("stockIn.filter")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {t("stockIn.sort")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSort("date")}>{t("stockIn.sort.date")} {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("supplier")}>{t("stockIn.sort.supplier")} {sortBy === "supplier" && (sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("amount")}>{t("stockIn.sort.amount")} {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("status")}>{t("stockIn.status")} {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
