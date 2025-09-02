

// Central currency formatting utility for VND, easily extendable for other currencies in the future
export function formatCurrencyVND(amount: number): string {
    // Always format as VND with symbol
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

// Optionally, update the default formatCurrency to use VND for now
export function formatCurrency(amount: number): string {
    return formatCurrencyVND(amount)
}

// Update formatLargeCurrency to use the new utility and VND symbol
export const formatLargeCurrency = (amount: number, fixed: number = 2): string => {
    if (!amount) return "0 ₫"
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(fixed)}B ₫`
    }
    return `${amount.toLocaleString()} ₫`
}