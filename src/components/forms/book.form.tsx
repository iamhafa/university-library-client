// components/forms/book.form.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/errors/error-message";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import AuthorApiService, { type TAuthor } from "@/services/author.service";
import GenreApiService, { type TGenre } from "@/services/genre.service";
import PublisherApiService, { type TPublisher } from "@/services/publisher.service";
import { bookFormSchema, TBookFormValues } from "@/schemas/book-form.schema";
import MultiSelect from "@/components/customs/multi-select";

type Props = {
  onSubmit: (values: TBookFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TBookFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const BookForm: FC<Props> = ({ onSubmit, onCancel, defaultValues = {}, submitButtonText, isLoading = false }) => {
  const [genreOptions, setGenreOptions] = useState<TGenre[]>([]);
  const [authorOptions, setAuthorOptions] = useState<TAuthor[]>([]);
  const [publisherOptions, setPublisherOptions] = useState<TPublisher[]>([]);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TBookFormValues>({
    resolver: zodResolver(bookFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  // Fetch select options
  useEffect(() => {
    const fetchSelectOptions = async (): Promise<void> => {
      try {
        setOptionsLoading(true);
        const [{ dataPart: authors }, { dataPart: genres }, { dataPart: publishers }] = await Promise.all([
          AuthorApiService.getAll({}),
          GenreApiService.getAll({}),
          PublisherApiService.getAll({}),
        ]);

        setAuthorOptions(authors.data);
        setGenreOptions(genres.data);
        setPublisherOptions(publishers.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchSelectOptions();
  }, []);

  // Set default values when they change (for edit mode)
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof TBookFormValues, value);
        }
      });
    }
  }, [defaultValues, setValue]);

  const onValidSubmit = async (values: TBookFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const onInvalidSubmit = (errors: FieldErrors<TBookFormValues>): void => {
    console.error("Form validation errors:", errors);
  };

  if (optionsLoading) {
    return <div className="p-10">Đang tải dữ liệu...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6 p-10">
      <div className="col-span-1">
        <Label htmlFor="title">Tên sách</Label>
        <Input id="title" {...register("title")} disabled={isLoading} />
        <ErrorMessage message={errors.title?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="genre_id">Thể loại</Label>
        <Controller
          name="genre_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {genreOptions.map((genre: TGenre) => (
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

      {/* Author MultiSelect */}
      <MultiSelect
        control={control}
        name="author_ids"
        items={authorOptions}
        label="Tác giả"
        addButtonText="Thêm tác giả"
        placeholder="Chọn tác giả..."
        selectedLabel="Tác giả đã chọn:"
        displayField="name"
        maxSelections={3}
        disabled={isLoading}
        rules={{
          required: "Vui lòng chọn ít nhất một tác giả",
          validate: (value: number[]) => {
            if (value.length === 0) return "Phải chọn ít nhất một tác giả";
            if (value.length > 3) return "Chỉ được chọn tối đa 3 tác giả";
            return true;
          },
        }}
      />

      <div className="col-span-1">
        <Label htmlFor="publisher_id">Nhà xuất bản</Label>
        <Controller
          name="publisher_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhà xuất bản" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {publisherOptions.map((publisher: TPublisher) => (
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
        <Input id="price" {...register("price")} disabled={isLoading} />
        <ErrorMessage message={errors.price?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="quantity">Số lượng</Label>
        <Input id="quantity" {...register("quantity")} disabled={isLoading} />
        <ErrorMessage message={errors.quantity?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="total_page">Tổng số trang</Label>
        <Input id="total_page" {...register("total_page")} disabled={isLoading} />
        <ErrorMessage message={errors.total_page?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="ISBN">ISBN</Label>
        <Input id="ISBN" {...register("ISBN")} disabled={isLoading} />
        <ErrorMessage message={errors.ISBN?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="image_url">Đường dẫn ảnh</Label>
        <Input id="image_url" placeholder="https://image.com" {...register("image_url")} disabled={isLoading} />
        <ErrorMessage message={errors.image_url?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="publish_date">Năm xuất bản</Label>
        <Input id="publish_date" type="date" {...register("publish_date")} disabled={isLoading} />
        <ErrorMessage message={errors.publish_date?.message} />
      </div>

      <div className="col-span-2">
        <Label htmlFor="description">Mô tả (tùy chọn)</Label>
        <Textarea id="description" {...register("description")} className="min-h-[120px]" disabled={isLoading} />
      </div>

      <div className="col-span-2 flex justify-between">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
};
