import { z } from "zod";

export type TAuthorFormValues = z.infer<typeof authorFormSchema>;

export const authorFormSchema = z.object({
  name: z
    .string({
      required_error: "Tên tác giả không được để trống",
      invalid_type_error: "Tên tác giả phải là chuỗi",
    })
    .nonempty("Tên sách không được để trống"),

  bio: z.string({
    invalid_type_error: "Tiểu sử tác giả phải là chuỗi",
  }),
});
