/**
 * Format a number as Indonesian Rupiah (IDR)
 * @param value - The number to format
 * @returns Formatted string (e.g., Rp 1.000.000)
 */
export const formatCurrency = (value: number | string, currency = "IDR"): string => {
   const numberValue = typeof value === "string" ? parseFloat(value) : value;
   if (isNaN(numberValue)) return "Rp 0";

   return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(numberValue);
};

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @returns Formatted string (e.g., 1.000.000)
 */
export const formatNumber = (value: number | string): string => {
   const numberValue = typeof value === "string" ? parseFloat(value) : value;
   if (isNaN(numberValue)) return "0";

   return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
   }).format(numberValue);
};
