import { ImageIcon } from 'lucide-react';
import { IOrderItem } from '@/types';
import { formatCurrency, formatSystemNumber } from '@/lib/utils';

interface OrderItemRowProps {
  item: IOrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {

  return (
    <div className="flex items-center space-x-3">
      {item.product?.image ? (
        <img
          src={item.product.image}
          alt={item.product?.name}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <ImageIcon className="w-12 h-12 text-gray-400" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#573e1c] truncate">
          {item.name}
        </p>
        <p className="text-xs font-medium text-[#737373]">
          {item.number}
        </p>
        <p className="text-xs text-[#8b6a42]">
          {formatCurrency(item.unitCost)} x {formatSystemNumber(item.quantity)}
        </p>
      </div>
      <div className="text-sm font-semibold text-[#573e1c]">
        {formatCurrency(item.totalCost)}
      </div>
    </div>
  );
}
