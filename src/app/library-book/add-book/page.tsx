"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/errors/error-message";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/common/app-header";

// define object schema
const formSchema = z.object({
  title: z.string().min(5, "Tối thiểu ít nhất 5 ký tự").max(50, "Tối đa 50 ký tự"),
  author: z.string().min(5, "Tối thiểu ít nhất 5 ký tự").max(50, "Tối đa 50 ký tự"),
  genre: z.string().min(5, "Tối thiểu ít nhất 5 ký tự").max(50, "Tối đa 50 ký tự"),
  ISBN: z.string().nonempty(),
  price: z.coerce.number().nonnegative().min(1, "Tối thiểu ít nhất 1 đơn vị"),
  total_page: z.coerce.number().nonnegative().min(1, "Tối thiểu ít nhất 1 đơn vị").max(1000),
  quantity: z.coerce.number().nonnegative().min(1, "Tối thiểu ít nhất 1 đơn vị").max(1000),
  publisher: z.string(),
  publish_date: z.string(),
  description: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export default function AddBook() {
  const router = useRouter();
  // prettier-ignore
  const { register, handleSubmit, formState: { errors }} = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      title: "",
      author: "",
      ISBN: "",
      price: undefined,
      total_page: undefined,
      quantity: undefined,
      genre: "",
      publisher: "",
      publish_date: "", // Defaults to today
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="mx-auto bg-white rounded-lg">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Thêm sách mới</h1> */}
      <AppHeader title="Thêm sách mới" />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6 p-8">
        <div className="col-span-1">
          <Label htmlFor="title">Tên sách</Label>
          <Input id="title" placeholder="Nhập tên sách" {...register("title")} />
          <ErrorMessage message={errors.title?.message} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="genre">Thể loại</Label>
          <Input id="genre" placeholder="Nhập thể loại sách" {...register("genre")} />
          <ErrorMessage message={errors.genre?.message} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="author">Tác giả</Label>
          <Input id="author" placeholder="Nhập tên tác giả" {...register("author")} />
          <ErrorMessage message={errors.author?.message} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="price">Giá tiền</Label>
          <Input id="price" placeholder="Nhập giá tiền" {...register("price")} />
          <ErrorMessage message={errors.price?.message} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="quantity">Số lượng</Label>
          <Input id="quantity" placeholder="Nhập số lượng" {...register("quantity")} />
          <ErrorMessage message={errors.quantity?.message} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="genre">Tổng số trang</Label>
          <Input id="genre" placeholder="Nhập tổng số trang" {...register("total_page")} />
          <ErrorMessage message={errors.total_page?.message} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="ISBN">ISBN</Label>
          <Input id="ISBN" placeholder="Nhập ISBN" {...register("ISBN")} />
          <ErrorMessage message={errors.ISBN?.message} />
        </div>

        <div className="col-span-1">
          <Label htmlFor="publish_date">Năm xuất bản</Label>
          <Input id="publish_date" placeholder="Nhập năm xuất bản" {...register("publish_date")} />
          <ErrorMessage message={errors.publish_date?.message} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            placeholder="Mô tả sách (tuỳ chọn)"
            {...register("description")}
          />
        </div>

        <div className="col-span-2 flex justify-between">
          <Button variant="outline" type="button" onClick={router.back}>
            Hủy
          </Button>
          <Button type="submit">Lưu sách</Button>
        </div>
      </form>
    </div>
  );
}
