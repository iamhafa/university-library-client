// src/components/forms/borrowing.form.tsx
"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/errors/error-message";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { borrowingFormSchema, TBorrowingFormValues, TBorrowingItemsFormValues } from "@/schemas/borrowing-form.schema";
import MemberApiService, { type TMember } from "@/services/member.service";
import { BorrowingItemsForm } from "./borrowing-items.form";

type Props = {
  onSubmit: (values: TBorrowingFormValues, borrowingItems: TBorrowingItemsFormValues[]) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TBorrowingFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
  borrowingId?: string; // For edit mode
};

export const BorrowingForm: FC<Props> = ({
  onSubmit,
  onCancel,
  defaultValues = {},
  submitButtonText,
  isLoading = false,
  borrowingId,
}) => {
  const date = useRef<Date>(new Date());
  const [memberOptions, setMemberOptions] = useState<TMember[]>([]);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(true);
  const [borrowingItems, setBorrowingItems] = useState<TBorrowingItemsFormValues[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TBorrowingFormValues>({
    resolver: zodResolver(borrowingFormSchema),
    mode: "onSubmit",
    defaultValues: {
      ...defaultValues,
      borrowing_date: format(date.current, "yyyy-MM-dd"), // Default to today
      due_date: format(addDays(date.current, 15), "yyyy-MM-dd"), // Default to 15 days from now
      returned_date: null,
    },
  });

  // Fetch member options
  useEffect(() => {
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
  // useEffect(() => {
  //   if (defaultValues && Object.keys(defaultValues).length > 0) {
  //     Object.entries(defaultValues).forEach(([key, value]) => {
  //       if (value !== undefined) {
  //         setValue(key as keyof TBorrowingFormValues, value);
  //       }
  //     });
  //   }
  // }, [defaultValues, setValue]);

  useEffect(() => {
    console.log("borrowingItems changed:", borrowingItems);
  }, [borrowingItems]);

  const onValidSubmit = async (borrowing: TBorrowingFormValues): Promise<void> => {
    // Validate that at least one book is selected
    if (borrowingItems.length === 0) {
      alert("Vui lòng thêm ít nhất một cuốn sách để mượn.");
      return;
    }

    // Validate all borrowing items have required fields
    const isValidItems = borrowingItems.every((item) => item.book_id && item.quantity > 0 && item.price >= 0);

    if (!isValidItems) {
      alert("Vui lòng điền đầy đủ thông tin cho tất cả các cuốn sách.");
      return;
    }
    console.log(borrowing);
    console.log(borrowingItems);

    await onSubmit(borrowing, borrowingItems);
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
    <div className="p-10">
      <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6">
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

        {/* Borrowing Items Section */}
        <div className="col-span-2">
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Danh sách sách mượn</h3>
            <BorrowingItemsForm
              borrowingItems={borrowingItems}
              setBorrowingItems={setBorrowingItems}
              borrowingId={borrowingId}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="col-span-2 flex justify-between pt-6 border-t">
          <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};
