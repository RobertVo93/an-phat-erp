'use client';

import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormattedNumber } from '@/components/ui/formatted-number';
import { MAX_CART_ITEM_QUANTITY } from '@/constants';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
  inputClassName?: string;
  showDelete?: boolean;
  showAction?: boolean;
}

const clampQuantity = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;

  return value;
};

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = MAX_CART_ITEM_QUANTITY,
  disabled = false,
  id,
  className,
  inputClassName,
  showDelete,
  showAction,
}: QuantitySelectorProps) {
  const sanitizedQuantity = useMemo(
    () => clampQuantity(quantity, min, max),
    [max, min, quantity]
  );
  const [localQuantity, setLocalQuantity] = useState<number | ''>(sanitizedQuantity);

  useEffect(() => {
    setLocalQuantity(sanitizedQuantity);
  }, [sanitizedQuantity]);

  const updateInputQuantity = (value: number) => {
    setLocalQuantity(clampQuantity(value, min, max));
  };

  const commitQuantity = (value: number) => {
    const nextQuantity = clampQuantity(value, min, max);

    setLocalQuantity(nextQuantity);

    if (sanitizedQuantity !== nextQuantity) {
      onQuantityChange(nextQuantity);
    }
  };

  const handleDecreaseClick = () => {
    if (localQuantity === '') {
      commitQuantity(min);
      return;
    }

    if (localQuantity <= min) {
      onQuantityChange(0);
      return;
    }

    commitQuantity(localQuantity - 1);
  };

  const handleIncreaseClick = () => {
    commitQuantity(localQuantity === '' ? min : localQuantity + 1);
  };

  const showDeleteButton = showDelete && localQuantity === min;

  return (
    <div className={cn('flex items-center rounded-lg max-h-[40px]', className)}>
      {showAction && <Button
        variant="ghost"
        size="sm"
        disabled={disabled || localQuantity === ''}
        onClick={handleDecreaseClick}
        className={cn(
          'text-[#573e1c] hover:bg-[#efe1c1]',
          showDeleteButton && 'text-red-600 hover:text-red-700 hover:bg-red-50'
        )}
        aria-label={showDeleteButton ? 'Remove item' : 'Decrease quantity'}
      >
        {showDeleteButton ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
      </Button>}
      <FormattedNumber
        as="input"
        id={id}
        value={localQuantity}
        min={min}
        max={max}
        onValueChange={updateInputQuantity}
        onEmptyValue={() => {
          setLocalQuantity('');
        }}
        onBlur={() => {
          if (localQuantity === '') {
            commitQuantity(min);
            return;
          }

          commitQuantity(localQuantity);
        }}
        allowEmpty
        disabled={disabled}
        className={cn("max-h-[38px] text-center focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0", inputClassName)}
      />
      {showAction && <Button
        variant="ghost"
        size="sm"
        disabled={disabled || localQuantity === '' || localQuantity >= max}
        onClick={handleIncreaseClick}
        hidden={!showAction}
        className="text-[#573e1c] hover:bg-[#efe1c1]"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </Button>}
    </div>
  );
}
