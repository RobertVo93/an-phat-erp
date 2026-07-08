import type { Product, ProductTierPrice } from "@/types/product";

type PricingProduct = Partial<Pick<Product, "price" | "tierPrices">> & {
  unitCost?: number;
};

export function getProductPriceByQuantity(
  product: PricingProduct,
  quantity: number,
) {
  const tiers = getSortedTierPrices(product.tierPrices);
  const matchingTier = tiers.find((tier) => {
    const withinMin = quantity >= tier.minQuantity;
    const withinMax = tier.maxQuantity === undefined || quantity <= tier.maxQuantity;
    return withinMin && withinMax;
  });

  return matchingTier?.price ?? product.price ?? product.unitCost ?? 0;
}

export function getSortedTierPrices(tierPrices?: ProductTierPrice[]) {
  return (tierPrices || [])
    .filter((tier) => tier.minQuantity > 0 && tier.price >= 0)
    .slice()
    .sort((a, b) => a.minQuantity - b.minQuantity);
}
