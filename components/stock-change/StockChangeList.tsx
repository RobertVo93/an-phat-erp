import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, CheckCheck } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { StockChange } from "@/types/stock-change";
import { StockChangeStatus } from "@/types";
import { formatDate, formatLargeCurrency, formatNumberWithCommas, getStockChangeStatusColor } from "@/lib/utils";
import Link from "next/link";
import { ADMIN_ROUTES } from "@/constants";
import { FormattedCurrency } from "../ui/formatted-currency";
import { ServersidePagination } from "@/components/common/table/ServersidePagination";

export interface StockChangeListProps {
  records: StockChange[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onView: (stockChange: StockChange) => void;
  onEdit: (stockChange: StockChange) => void;
  onDelete: (stockChange: StockChange) => void;
  handleAutoComplete: (stockChange: StockChange) => void
  onPageChange: (page: number) => void;
}

export const StockChangeList: React.FC<StockChangeListProps> = ({
  records,
  total,
  currentPage,
  pageSize,
  totalPages,
  onView,
  onEdit,
  onDelete,
  handleAutoComplete,
  onPageChange,
}) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="p-4 border rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div className="w-full flex items-center justify-between space-x-3">
              <h3 className="text-sm font-medium">
                {record.id ? (
                  <Link href={ADMIN_ROUTES.stockChangeDetail(record.id)} className="text-blue-600">
                    {record.number}
                  </Link>
                ) : (
                  record.number
                )}
              </h3>
              <Badge className={getStockChangeStatusColor(record.status!)}>{t(`stockIn.status.${record.status}`)}</Badge>
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <FormattedCurrency as="div" className="text-sm font-bold" value={record.totalAmount}/>
              {/* <div className="text-sm font-bold">{formatLargeCurrency(record.totalAmount!)}</div> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onView(record)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("stockIn.view")}
                  </DropdownMenuItem>
                  {record.status !== StockChangeStatus.completed && (
                    <DropdownMenuItem onClick={() => onEdit(record)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("stockIn.edit")}
                    </DropdownMenuItem>
                  )}
                  {record.status !== StockChangeStatus.completed && (
                    <DropdownMenuItem onClick={() => handleAutoComplete(record)} className="text-green-600">
                      <CheckCheck className="mr-2 h-4 w-4" />
                      {t("stockIn.form.autoComplete")}
                    </DropdownMenuItem>
                  )}
                  {record.status !== StockChangeStatus.completed && (
                    <DropdownMenuItem onClick={() => onDelete(record)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("stockIn.delete")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-muted-foreground mb-3">
            <div className="w-full flex justify-between">
              <span className="font-medium">{t("stockIn.stockType")}:</span> {t(`stockIn.form.${record.type}`)}
            </div>
            <div className="w-full flex justify-between">
              <span className="font-medium">{t("stockIn.date")}:</span> {formatDate(`${record.date}`)}
            </div>
            {record.receivedBy && (
              <div className="w-full flex justify-between">
                <span className="font-medium">{t("stockIn.receivedBy")}:</span> {record.receivedBy}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{t("stockIn.products")}:</p>
            {record.stockProducts && record.stockProducts.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span>{item.sku}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span>
                    {formatNumberWithCommas(item.quantity!)} × {formatLargeCurrency(item.unitCost!)}
                  </span>
                  <FormattedCurrency as="span" className="text-xs font-bold" value={item.totalCost}/>
                </div>
              </div>
            ))}
            {record.stockProducts && record.stockProducts.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{record.stockProducts.length - 3} {t("stockIn.otherProducts")}
              </div>
            )}
          </div>
        </div>
      ))}

      <ServersidePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
};
