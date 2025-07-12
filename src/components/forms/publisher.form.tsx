// components/forms/publisher.form.tsx
"use client";

import { FC, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/errors/error-message";
import { TPublisherFormValues, publisherFormSchema } from "@/schemas/publisher-form.schema";

type Props = {
  onSubmit: (values: TPublisherFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TPublisherFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const PublisherForm: FC<Props> = ({ onSubmit, onCancel, defaultValues = {}, submitButtonText, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TPublisherFormValues>({
    resolver: zodResolver(publisherFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  console.log(defaultValues);

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof TPublisherFormValues, value);
        }
      });
    }
  }, [defaultValues, setValue]);

  const onValidSubmit = async (values: TPublisherFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const onInvalidSubmit = (errors: FieldErrors<TPublisherFormValues>): void => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6 p-10">
      <div className="col-span-1">
        <Label htmlFor="name">Tên nhà xuất bản</Label>
        <Input id="name" {...register("name")} placeholder="Nhập tên nhà xuất bản" disabled={isLoading} />
        <ErrorMessage message={errors.name?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input id="address" {...register("address")} placeholder="Nhập địa chỉ" disabled={isLoading} />
        <ErrorMessage message={errors.address?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="contact_number">Số điện thoại</Label>
        <Input id="contact_number" {...register("contact_number")} placeholder="Nhập số điện thoại" disabled={isLoading} />
        <ErrorMessage message={errors.contact_number?.message} />
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
