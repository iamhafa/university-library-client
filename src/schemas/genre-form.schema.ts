import { z } from "zod";

export type TGenreFormValues = z.infer<typeof genreFormSchema>;

export const genreFormSchema = z.object({
  name: z
    .string({
      required_error: "Tên thể loại không được để trống",
      invalid_type_error: "Tên thể loại phải là chuỗi",
    })
    .nonempty("Tên thể loại không được để trống"),
});
