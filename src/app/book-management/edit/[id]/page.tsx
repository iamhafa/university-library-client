"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/errors/error-message";
import AppHeader from "@/components/common/app-header";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import AuthorApiService, { Author } from "@/services/author.service";
import GenreApiService, { Genre } from "@/services/genre.service";
import PublisherApiService, { Publisher } from "@/services/publisher.service";
import BookServiceApi from "@/services/book.service";
import { bookFormSchema, TBookFormValues } from "@/schemas/book-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function UpdateBook() {
  const router = useRouter();
  const { id: bookId } = useParams<{ id: string }>();

  const [genreOptions, setGenreOptions] = useState<Genre[]>([]);
  const [authorOptions, setAuthorOptions] = useState<Author[]>([]);
  const [publisherOptions, setPublisherOptions] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm<TBookFormValues>({
    resolver: zodResolver(bookFormSchema),
    mode: "onSubmit",
  });

  // Fetch danh sách option và dữ liệu sách
  useEffect(() => {
    const fetchSelectOptions = async (): Promise<void> => {
      const [{ dataPart: authors }, { dataPart: genres }, { dataPart: publishers }] = await Promise.all([
        AuthorApiService.getAll({}),
        GenreApiService.getAll({}),
        PublisherApiService.getAll({}),
      ]);

      setAuthorOptions(authors.data);
      setGenreOptions(genres.data);
      setPublisherOptions(publishers.data);
    };

    const fetchBookData = async (): Promise<void> => {
      setIsLoading(true);
      const { dataPart, error } = await BookServiceApi.getById(bookId);

      if (dataPart) {
        // Đổ dữ liệu sách vào form
        setValue("title", dataPart.title);
        setValue("genre_id", dataPart.genre_id);
        setValue("author_id", dataPart.author_id);
        setValue("publisher_id", dataPart.publisher_id);
        setValue("price", dataPart.price);
        setValue("quantity", dataPart.quantity);
        setValue("total_page", dataPart.total_page);
        setValue("ISBN", dataPart.ISBN);
        setValue("image_url", dataPart.image_url);
        setValue("publish_date", dataPart.publish_date);
        setValue("description", dataPart.description || "");
      } else {
        toast.error(error || "Không tìm thấy sách!");
        router.push(EAppRouter.BOOK_MANGEMENT_PAGE);
      }
      setIsLoading(false);
    };

    fetchSelectOptions();
    fetchBookData();
  }, [bookId, setValue, router]);

  const onValidSubmit = async (values: TBookFormValues): Promise<void> => {
    if (!bookId) {
      toast.error("Không tìm thấy ID sách để cập nhật!");
      return;
    }

    const { results, error } = await BookServiceApi.updateById(bookId, values);

    if (results === "1") {
      toast.success("Cập nhật sách thành công!", { richColors: true });
      router.push(EAppRouter.BOOK_MANGEMENT_PAGE);
    } else {
      toast.error(error || "Cập nhật thất bại!");
    }
  };

  const onInvalidSubmit = (errors: FieldErrors<TBookFormValues>): void => {
    toast.error("Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.");
    console.error(errors);
  };

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Cập nhật sách" />

      {isLoading ? (
        <p>Đang tải dữ liệu sách...</p>
      ) : (
        <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6 p-10">
          <div className="col-span-1">
            <Label htmlFor="title">Tên sách</Label>
            <Input id="title" {...register("title")} />
            <ErrorMessage message={errors.title?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="genre_id">Thể loại</Label>
            <Controller
              name="genre_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thể loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {genreOptions.map((genre: Genre) => (
                        <SelectItem key={genre.id} value={String(genre.id)}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <ErrorMessage message={errors.genre_id?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="author_id">Tác giả</Label>
            <Controller
              name="author_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tác giả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {authorOptions.map((author: Author) => (
                        <SelectItem key={author.id} value={String(author.id)}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <ErrorMessage message={errors.author_id?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="publisher_id">Nhà xuất bản</Label>
            <Controller
              name="publisher_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhà xuất bản" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {publisherOptions.map((publisher: Publisher) => (
                        <SelectItem key={publisher.id} value={String(publisher.id)}>
                          {publisher.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <ErrorMessage message={errors.publisher_id?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="price">Giá tiền</Label>
            <Input id="price" {...register("price")} />
            <ErrorMessage message={errors.price?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="quantity">Số lượng</Label>
            <Input id="quantity" {...register("quantity")} />
            <ErrorMessage message={errors.quantity?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="total_page">Tổng số trang</Label>
            <Input id="total_page" {...register("total_page")} />
            <ErrorMessage message={errors.total_page?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="ISBN">ISBN</Label>
            <Input id="ISBN" {...register("ISBN")} />
            <ErrorMessage message={errors.ISBN?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="image_url">Đường dẫn ảnh</Label>
            <Input id="image_url" placeholder="https://image.com" {...register("image_url")} />
            <ErrorMessage message={errors.image_url?.message} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="publish_date">Năm xuất bản</Label>
            <Input id="publish_date" {...register("publish_date")} />
            <ErrorMessage message={errors.publish_date?.message} />
          </div>

          <div className="col-span-2">
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea id="description" {...register("description")} className="min-h-[120px]" />
          </div>

          <div className="col-span-2 flex justify-between">
            <Button variant="outline" type="button" onClick={router.back}>
              Hủy
            </Button>
            <Button type="submit">Cập nhật sách</Button>
          </div>
        </form>
      )}
    </div>
  );
}
