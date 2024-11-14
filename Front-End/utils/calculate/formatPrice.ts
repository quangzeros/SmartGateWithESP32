export function formatCurrencyVND(amount: any) {
  // Sử dụng phương thức Intl.NumberFormat để định dạng số
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
