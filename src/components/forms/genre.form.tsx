// components/forms/author.form.tsx
"use client";

import { FC, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/errors/error-message";
import { genreFormSchema, TGenreFormValues } from "@/schemas/genre-form.schema";

type Props = {
  onSubmit: (values: TGenreFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TGenreFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const GenreForm: FC<Props> = ({ onSubmit, onCancel, defaultValues = {}, submitButtonText, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TGenreFormValues>({
    resolver: zodResolver(genreFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  // Set default values when they change (for edit mode)
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof TGenreFormValues, value);
        }
      });
    }
  }, [defaultValues, setValue]);

  const onValidSubmit = async (values: TGenreFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const onInvalidSubmit = (errors: FieldErrors<TGenreFormValues>): void => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-1 gap-y-6 p-10 max-w-2xl">
      <div className="col-span-1">
        <Label htmlFor="name">Tên thể loại</Label>
        <Input id="name" {...register("name")} placeholder="Nhập tên thể loại" disabled={isLoading} />
        <ErrorMessage message={errors.name?.message} />
      </div>

      <div className="col-span-1 flex justify-between">
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
