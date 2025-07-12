
import { z } from "zod";

export type TPublisherFormValues = z.infer<typeof publisherFormSchema>;

export const publisherFormSchema = z.object({
  name: z.string().min(1, { message: "Tên nhà xuất bản không được để trống" }),
  address: z.string().min(1, { message: "Địa chỉ không được để trống" }),
  contact_number: z.string().min(1, { message: "Số điện thoại không được để trống" }),
});
