export enum BORROWING_STATUS {
  BORROWING = "BORROWING", // đang mượn
  RETURNED = "RETURNED", // đã trả sách
  OVERDUE = "OVERDUE", // quá hạn
  CANCELLED = "CANCELLED", // hủy lượt mượn sách
  PENDING = "PENDING",
  LOST = "LOST", // sách đã mất,
  COMPENSATED = "COMPENSATED", // đã bồi thường do bị phạt do trả trễ sách
  PAID_FINE = "PAID_FINE",
}
