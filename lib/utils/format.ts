export const formatCurrency = (value: number, minimumFractionDigits = 0, maximumFractionDigits = 0) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);
};

export const formatCompactNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};
