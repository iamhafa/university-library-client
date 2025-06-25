// src/app/borrowing-management/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { BorrowingForm } from "@/components/forms/borrowing.form";
import { TBorrowingFormValues, TBorrowingItemsFormValues } from "@/schemas/borrowing-form.schema";
import BorrowingApiService, { TBorrowing } from "@/services/borrowing.service";
import { BorrowingItemsService } from "@/services/borrowing-items.service";
import { EAppRouter } from "@/constants/app-router.enum";
import { AppHeader } from "@/components/common/app-header";

export default function EditBorrowingPage() {
  const router = useRouter();
  const { id: borrowingId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [borrowing, setBorrowing] = useState<TBorrowing>();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowing = async () => {
      try {
        setDataLoading(true);
        const { dataPart } = await BorrowingApiService.getById(borrowingId);
        setBorrowing(dataPart);
      } catch (error) {
        console.error("Error fetching borrowing:", error);
        toast.error("Không thể tải thông tin lượt mượn. Vui lòng thử lại.", { richColors: true });
        router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
      } finally {
        setDataLoading(false);
      }
    };

    if (borrowingId) {
      fetchBorrowing();
    }
  }, [borrowingId, router]);

  const handleSubmit = async (borrowing: TBorrowingFormValues, borrowingItems: TBorrowingItemsFormValues[]): Promise<void> => {
    console.log(borrowingItems);

    try {
      setIsLoading(true);

      // Step 1: Update borrowing record
      const { results, error, dataPart: updateBorrowing } = await BorrowingApiService.updateById(borrowingId, borrowing);

      if (results === "1") {
        setBorrowing(updateBorrowing);

        // Step 2: Update borrowing items (bulk update)
        if (borrowingItems.length > 0) {
          try {
            const { results } = await BorrowingItemsService.updateBulk(borrowingId, borrowingItems);

            if (results !== "1") {
              toast.error("Cập nhật thông tin lượt mượn thành công nhưng có lỗi khi cập nhật danh sách sách!");
              return;
            }
          } catch (error) {
            console.error("Error updating borrowing items:", error);
            toast.error("Cập nhật thông tin lượt mượn thành công nhưng có lỗi khi cập nhật danh sách sách!");
            return;
          }
        }

        // Success
        toast.success("Cập nhật lượt mượn thành công!", { richColors: true });
      } else {
        toast.error(error || "Cập nhật thông tin lượt mượn thất bại!");
        return;
      }
    } catch (error) {
      console.error("Error updating borrowing:", error);
      toast.error("Có lỗi xảy ra khi cập nhật lượt mượn. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!borrowing) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">Không tìm thấy thông tin lượt mượn.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AppHeader title="Chỉnh sửa lượt mượn" />
      <BorrowingForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE)}
        submitButtonText="Cập nhật lượt mượn"
        isLoading={isLoading}
        borrowingId={borrowingId}
        defaultValues={{
          member_id: borrowing.member_id,
          borrowing_date: borrowing.borrowing_date,
          due_date: borrowing.due_date,
          returned_date: null,
        }}
      />
    </div>
  );
}
