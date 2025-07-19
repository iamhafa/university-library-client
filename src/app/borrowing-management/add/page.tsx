"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { BorrowingForm } from "@/components/forms/borrowing.form";
import { TBorrowingFormValues, TBorrowingItemsFormValues } from "@/schemas/borrowing-form.schema";
import BorrowingServiceApi from "@/services/borrowing.service";
import { BorrowingItemsService } from "@/services/borrowing-items.service";

export default function AddBorrowing() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TBorrowingFormValues, borrowingItems: TBorrowingItemsFormValues[]): Promise<void> => {
    try {
      setIsSubmitting(true);

      // Step 1: Create borrowing record
      const { results, dataPart, error } = await BorrowingServiceApi.create(values);
      console.log(borrowingItems);

      if (results === "1" && dataPart.id) {
        // Step 2: Create borrowing items
        if (borrowingItems.length > 0) {
          try {
            const { results } = await BorrowingItemsService.createBulk(dataPart.id, borrowingItems);

            if (results !== "1") {
              toast.error("Tạo lượt mượn thành công nhưng có lỗi khi thêm sách!");
              router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
            }
          } catch (err) {
            console.error("Error creating borrowing items:", err);
            toast.error("Tạo lượt mượn thành công nhưng có lỗi khi thêm sách!");
            router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
          }
        }

        toast.success("Tạo lượt mượn sách thành công!", { richColors: true });
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
        defaultValues={{
          returned_date: null,
        }}
      />
    </div>
  );
}
