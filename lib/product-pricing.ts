import type { Product, ProductTierPrice } from "@/types/product";

type PricingProduct = Partial<Pick<Product, "price" | "tierPrices">> & {
  unitCost?: number;
};

export function getProductPriceByQuantity(
  product: PricingProduct,
  quantity: number,
) {
  const tiers = getOrderedTierPrices(product.tierPrices);
  const matchingTier = tiers.find((tier) => {
    const withinMin = quantity >= tier.minQuantity;
    const withinMax = tier.maxQuantity === undefined || quantity <= tier.maxQuantity;
    return withinMin && withinMax;
  });

  return matchingTier?.price ?? product.price ?? product.unitCost ?? 0;
}

export function createDefaultTierPrice(productPrice = 0): ProductTierPrice {
  return {
    minQuantity: 1,
    price: productPrice,
    order: 1,
  };
}

export function normalizeTierPrices(tierPrices?: ProductTierPrice[],productPrice = 0): ProductTierPrice[] {
  const sourceTiers = tierPrices && tierPrices.length > 0
    ? tierPrices
    : [createDefaultTierPrice(productPrice)];
  const hasOrder = sourceTiers.every((tier) => typeof (tier as Partial<ProductTierPrice>).order === "number");
  const orderedTiers = sourceTiers.slice().sort((a, b) => {
    if (hasOrder) {
      return a.order - b.order;
    }

    return a.minQuantity - b.minQuantity;
  });

  return orderedTiers.map((tier, index) => {
    const previousTier = orderedTiers[index - 1];
    const minQuantity = index === 0
      ? 1
      : previousTier?.maxQuantity !== undefined
        ? previousTier.maxQuantity + 1
        : tier.minQuantity;

    return {
      ...tier,
      minQuantity,
      order: index + 1,
    };
  });
}

export function getOrderedTierPrices(tierPrices?: ProductTierPrice[]) {
  return (tierPrices || [])
    .filter((tier) => tier.minQuantity > 0 && tier.price >= 0)
    .filter((tier) => {
      const order = (tier as Partial<ProductTierPrice>).order;
      return order === undefined || order > 0;
    });
}
