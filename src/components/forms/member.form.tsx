// components/forms/author.form.tsx
"use client";

import { FC, useEffect } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/errors/error-message";
import { memberFormSchema, TMemberFormValues } from "@/schemas/member-form.schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MEMBER_TYPE, MEMBER_TYPE_DISPLAY } from "@/constants/member.enum";
import { displayMemberType } from "@/helpers/display-member-type";

type Props = {
  onSubmit: (values: TMemberFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TMemberFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const MemberForm: FC<Props> = ({ onSubmit, onCancel, defaultValues = {}, submitButtonText, isLoading = false }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TMemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  // Set default values when they change (for edit mode)
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof TMemberFormValues, value);
        }
      });
    }
  }, [defaultValues, setValue]);

  const onValidSubmit = async (values: TMemberFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const onInvalidSubmit = (errors: FieldErrors<TMemberFormValues>): void => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6 p-10">
      <div className="col-span-1">
        <Label htmlFor="name">Họ và tên</Label>
        <Input id="name" {...register("name")} placeholder="Nhập họ tên" disabled={isLoading} />
        <ErrorMessage message={errors.name?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} placeholder="Nhập email" disabled={isLoading} />
        <ErrorMessage message={errors.name?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="phone_number">Số điện thoại</Label>
        <Input id="phone_number" {...register("phone_number")} placeholder="Nhập số điện thoại" disabled={isLoading} />
        <ErrorMessage message={errors.phone_number?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="member_type">Loại thành viên</Label>
        <Controller
          name="member_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thành viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(MEMBER_TYPE).map((memberType: MEMBER_TYPE, index: number) => (
                    <SelectItem key={index} value={memberType}>
                      {displayMemberType(memberType)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <ErrorMessage message={errors.member_type?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input id="address" {...register("address")} placeholder="Nhập địa chỉ" disabled={isLoading} />
        <ErrorMessage message={errors.address?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="enrollment_date">Ngày tham gia</Label>
        <Input
          id="enrollment_date"
          type="date"
          {...register("enrollment_date")}
          placeholder="Chọn ngày tham gia"
          disabled={isLoading}
        />
        <ErrorMessage message={errors.enrollment_date?.message} />
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
