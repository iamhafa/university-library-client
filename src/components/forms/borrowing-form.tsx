// components/forms/BorrowingForm.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/errors/error-message";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { borrowingFormSchema, TBorrowingFormValues } from "@/schemas/borrowing-form.schema";
import MemberApiService, { TMember } from "@/services/member.service";

type Props = {
  onSubmit: (values: TBorrowingFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TBorrowingFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const BorrowingForm: FC<Props> = ({ onSubmit, onCancel, defaultValues = {}, submitButtonText, isLoading = false }) => {
  const [memberOptions, setMemberOptions] = useState<TMember[]>([]);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TBorrowingFormValues>({
    resolver: zodResolver(borrowingFormSchema),
    mode: "onSubmit",
    defaultValues: {
      borrowing_date: new Date().toISOString().split("T")[0], // Default to today
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default to 14 days from now
      ...defaultValues,
    },
  });

  // Fetch member options
  useEffect(() => {
    console.log(defaultValues);

    const fetchMemberOptions = async (): Promise<void> => {
      try {
        setOptionsLoading(true);
        const { dataPart: members } = await MemberApiService.getAll({});
        setMemberOptions(members.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchMemberOptions();
  }, []);

  // Set default values when they change (for edit mode)
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof TBorrowingFormValues, value);
        }
      });
    }
  }, [defaultValues, setValue]);

  const onValidSubmit = async (values: TBorrowingFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const onInvalidSubmit = (errors: FieldErrors<TBorrowingFormValues>): void => {
    console.error("Form validation errors:", errors);
  };

  const getMemberTypeLabel = (memberType: string): string => {
    const memberTypeMap = {
      UNDERGRADUATE_STUDENT: "Sinh viên đại học",
      POSTGRADUATE_STUDENT: "Sinh viên sau đại học",
      LIBRARY_STAFF: "Nhân viên thư viện",
    };
    return memberTypeMap[memberType as keyof typeof memberTypeMap] || memberType;
  };

  if (optionsLoading) {
    return <div className="p-10">Đang tải dữ liệu...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6 p-10">
      <div className="col-span-1">
        <Label htmlFor="member_id">Thành viên mượn sách</Label>
        <Controller
          name="member_id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              value={field.value?.toString()}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thành viên mượn sách" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {memberOptions.map((member: TMember) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {member.last_name} {member.first_name} -
                          <span className="text-sm text-gray-500">
                            ({member.email} • {getMemberTypeLabel(member.member_type)})
                          </span>
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <ErrorMessage message={errors.member_id?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="borrowing_date">Ngày mượn</Label>
        <Input id="borrowing_date" type="date" {...register("borrowing_date")} disabled={isLoading} />
        <ErrorMessage message={errors.borrowing_date?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="due_date">Ngày hết hạn</Label>
        <Input id="due_date" type="date" {...register("due_date")} disabled={isLoading} />
        <ErrorMessage message={errors.due_date?.message} />
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
