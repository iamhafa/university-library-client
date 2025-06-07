import { z } from "zod";
import { BORROWING_STATUS } from "@/constants/borrowing.enum";

export type TBorrowingFormValues = z.infer<typeof borrowingFormSchema>;
export type TBorrowingItemsFormValues = z.infer<typeof borrowingItemsFormSchema>;

// Schema for borrowing form
export const borrowingFormSchema = z.object({
  member_id: z.number({
    required_error: "Vui lòng chọn thành viên",
    invalid_type_error: "ID thành viên phải là số",
  }),
  status: z
    .nativeEnum(BORROWING_STATUS, {
      required_error: "Vui lòng chọn trạng thái",
      invalid_type_error: "Trạng thái không hợp lệ",
    })
    .default(BORROWING_STATUS.BORROWING),
  borrowing_date: z.string().min(1, "Vui lòng nhập ngày mượn"),
  due_date: z.string().min(1, "Vui lòng nhập ngày hết hạn"),
  returned_date: z.string().optional(),
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
});

export const borrowingItemsFormSchema = z.object({
  book_id: z.number({
    required_error: "Vui lòng chọn sách",
    invalid_type_error: "ID sách phải là số",
  }),
  borrowing_id: z.number({
    required_error: "ID phiếu mượn là bắt buộc",
    invalid_type_error: "ID phiếu mượn phải là số",
  }),
  quantity: z
    .number({
      required_error: "Vui lòng nhập số lượng",
      invalid_type_error: "Số lượng phải là số",
    })
    .min(1, "Số lượng phải lớn hơn 0"),
  price: z
    .number({
      required_error: "Vui lòng nhập giá sách",
      invalid_type_error: "Giá phải là số",
    })
    .min(0, "Giá phải lớn hơn 0"),
  returned_date: z
    .string({
      invalid_type_error: "Ngày trả phải là chuỗi ngày hợp lệ",
    })
    .optional(),
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
});
