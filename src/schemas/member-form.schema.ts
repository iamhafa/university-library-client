import { MEMBER_TYPE } from "@/constants/member.enum";
import { format } from "date-fns";
import { z } from "zod";

export type TMemberFormValues = z.infer<typeof memberFormSchema>;

export const memberFormSchema = z.object({
  name: z.string().min(1, { message: "Họ và tên không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }).default("12345678"),
  phone_number: z.string().min(1, { message: "Số điện thoại không được để trống" }),
  member_type: z
    .nativeEnum(MEMBER_TYPE, {
      required_error: "Vui lòng chọn loại thành viên",
      invalid_type_error: "Loại thành viên không hợp lệ",
    })
    .default(MEMBER_TYPE.UNDERGRADUATE_STUDENT),
  address: z.string().min(1, { message: "Địa chỉ không được để trống" }),
  enrollment_date: z
    .string()
    .min(1, { message: "Ngày tham gia không được để trống" })
    .default(() => format(new Date(), "yyyyMMdd")), // Default to today's date
});
