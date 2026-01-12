/**
 * Format a number as Indonesian Rupiah
 * @param amount - The number to format
 * @returns A string formatted as Rp X.XXX.XXX
 */
export const formatRupiah = (amount: number): string => {
   return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(amount);
};
