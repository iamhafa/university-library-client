export function currencyFormat(value: string): string {
  const amount: number = parseFloat(value);
  const formatted: string = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

  return formatted;
}
