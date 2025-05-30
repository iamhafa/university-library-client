import { z } from "zod";

export type TBookFormValues = z.infer<typeof bookFormSchema>;

export const bookFormSchema = z.object({
  title: z
    .string({
      required_error: "Tên sách không được để trống",
      invalid_type_error: "Tên sách phải là chuỗi",
    })
    .nonempty("Tên sách không được để trống"),

  image_url: z
    .string({
      required_error: "Đường dẫn ảnh không được để trống",
      // invalid_type_error: "Đường dẫn ảnh phải là chuỗi",
    })
    .optional(),

  genre_id: z.coerce
    .number({
      required_error: "Vui lòng chọn thể loại",
      invalid_type_error: "Thể loại không hợp lệ",
    })
    .int("Thể loại không hợp lệ"),

  author_ids: z.array(
    z.coerce
      .number({
        required_error: "Vui lòng chọn tác giả",
        invalid_type_error: "Tác giả không hợp lệ",
      })
      .int("Tác giả không hợp lệ")
  ),

  publisher_id: z.coerce
    .number({
      required_error: "Vui lòng chọn nhà xuất bản",
      invalid_type_error: "Nhà xuất bản không hợp lệ",
    })
    .int("Nhà xuất bản không hợp lệ"),

  price: z.coerce
    .number({
      required_error: "Giá bán là bắt buộc",
      invalid_type_error: "Giá bán phải là số",
    })
    .nonnegative("Giá bán không được âm")
    .min(1, "Giá bán phải lớn hơn 0"),

  quantity: z.coerce
    .number({
      required_error: "Số lượng là bắt buộc",
      invalid_type_error: "Số lượng phải là số",
    })
    .nonnegative("Số lượng không được âm")
    .min(1, "Số lượng tối thiểu là 1")
    .max(1000, "Số lượng tối đa là 1000"),

  total_page: z.coerce
    .number({
      required_error: "Số trang là bắt buộc",
      invalid_type_error: "Số trang phải là số",
    })
    .nonnegative("Số trang không được âm")
    .min(1, "Số trang tối thiểu là 1")
    .max(1000, "Số trang tối đa là 1000"),

  ISBN: z
    .string({
      required_error: "ISBN không được để trống",
      invalid_type_error: "ISBN phải là chuỗi",
    })
    .nonempty("ISBN không được để trống"),

  publish_date: z
    .string()
    .nonempty({ message: "Ngày xuất bản là bắt buộc" })
    .regex(/^\d{2}-\d{2}-\d{4}$/, {
      message: "Ngày xuất bản phải đúng định dạng DD-MM-YYY",
    })
    .optional(),

  description: z
    .string({
      required_error: "Mô tả là bắt buộc",
      invalid_type_error: "Mô tả phải là chuỗi",
    })
    .optional(),
});
