import { z } from "zod";
import { BORROWING_STATUS } from "@/constants/borrowing.enum";

export type TBorrowingFormValues = z.infer<typeof borrowingFormSchema>;

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
