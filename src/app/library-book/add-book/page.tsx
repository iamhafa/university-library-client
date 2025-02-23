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
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import AuthorApiService, { Author } from "@/services/author.service";
import GenreApiService, { Genre } from "@/services/genre.service";

// define object schema
const formSchema = z.object({
  title: z.string().min(5, "Tối thiểu ít nhất 5 ký tự").max(50, "Tối đa 50 ký tự"),
  // author: z.number(),
  genre: z.coerce.number({ required_error: "Please select value" }),
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
  const [genreOptions, setGenreOptions] = useState<Genre[]>([]);
  const [authorOptions, setAuthorOptions] = useState<Author[]>([]);

  // prettier-ignore
  const { register, handleSubmit, formState: { errors }} = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      title: "",
      // author: undefined,
      ISBN: "",
      price: undefined,
      total_page: undefined,
      quantity: undefined,
      genre: undefined,
      publisher: "",
      publish_date: "", // Defaults to today
      description: "",
    },
  });

  useEffect(() => {
    const fetchSelectOptions = async () => {
      const { dataPart: authors } = await AuthorApiService.getAll({});
      const { dataPart: genres } = await GenreApiService.getAll({});

      setAuthorOptions(authors.data);
      setGenreOptions(genres.data);
    };

    fetchSelectOptions();
  }, []);

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
          {/* <Input id="genre" placeholder="Nhập thể loại sách" {...register("genre")} /> */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Thể loại sách" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {genreOptions.map((genre: Genre, index: number) => (
                  <SelectItem key={index} value={String(genre.id)} {...register("genre")}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <ErrorMessage message={errors.genre?.message} /> */}
        </div>

        <div className="col-span-1">
          <Label htmlFor="author">Tác giả</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tên tác giả" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {authorOptions.map((author: Author, index: number) => (
                  <SelectItem key={index} value={String(author.id)}>
                    {`${author.first_name} ${author.last_name}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
