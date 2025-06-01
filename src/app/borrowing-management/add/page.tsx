// pages/add-book/page.tsx
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppHeader from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { BorrowingForm } from "@/components/forms/borrowing-form";
import { TBorrowingFormValues } from "@/schemas/borrowing-form.schema";
import BorrowingServiceApi from "@/services/borrowing.service";

export default function AddBorrowing() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TBorrowingFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { results, error } = await BorrowingServiceApi.create(values);

      if (results === "1") {
        toast.success("Tạo mượn sách thành công!", { richColors: true });
        router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
      } else {
        toast.error(error || "Tạo mượn sách thất bại!");
      }
    } catch (error) {
      console.error("Error creating borrowing:", error);
      toast.error("Có lỗi xảy ra khi tạo mượn sách!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Thêm lượt mượn sách mới" />
      <BorrowingForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitButtonText="Lưu lượt mượn"
        isLoading={isSubmitting}
      />
    </div>
  );
}
