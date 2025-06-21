export function currencyFormat(value: number): string {
  // const amount: number = parseFloat(value);
  const formatted: string = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

  return formatted;
}
