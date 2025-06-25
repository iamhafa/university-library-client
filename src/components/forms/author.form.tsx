// components/forms/author.form.tsx
"use client";

import { FC, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/errors/error-message";
import { authorFormSchema, TAuthorFormValues } from "@/schemas/author-form.schema";

type Props = {
  onSubmit: (values: TAuthorFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TAuthorFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const AuthorForm: FC<Props> = ({ onSubmit, onCancel, defaultValues = {}, submitButtonText, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TAuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  // Set default values when they change (for edit mode)
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof TAuthorFormValues, value);
        }
      });
    }
  }, [defaultValues, setValue]);

  const onValidSubmit = async (values: TAuthorFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const onInvalidSubmit = (errors: FieldErrors<TAuthorFormValues>): void => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-1 gap-y-6 p-10 max-w-2xl">
      <div className="col-span-1">
        <Label htmlFor="name">Tên tác giả</Label>
        <Input id="name" {...register("name")} placeholder="Nhập tên tác giả" disabled={isLoading} />
        <ErrorMessage message={errors.name?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="bio">Tiểu sử (tùy chọn)</Label>
        <Textarea
          id="bio"
          {...register("bio")}
          className="min-h-[120px]"
          placeholder="Nhập tiểu sử tác giả..."
          disabled={isLoading}
        />
        <ErrorMessage message={errors.bio?.message} />
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
