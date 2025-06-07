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
  const { id: borrowingId } = useParams<{ id: string }>();
  const router = useRouter();
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
        alert("Không thể tải thông tin lượt mượn. Vui lòng thử lại.");
        router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
      } finally {
        setDataLoading(false);
      }
    };

    fetchBorrowing();
  }, [borrowingId, router]);

  const handleSubmit = async (values: TBorrowingFormValues, borrowingItems: TBorrowingItemsFormValues[]) => {
    try {
      setIsLoading(true);

      // Update borrowing record
      const { results } = await BorrowingApiService.updateById(borrowingId, values);

      console.log(borrowingItems);

      if (results === "1") {
        toast.success("Update success");
      }

      // Update borrowing items (bulk update)
      if (borrowingItems.length > 0) {
        const { results } = await BorrowingItemsService.updateBulk(borrowingId, borrowingItems);
      }

      // Show success message
      alert("Cập nhật lượt mượn thành công!");

      // Redirect to borrowing list
      // router.push("/borrowing");
    } catch (error) {
      console.error("Error updating borrowing:", error);
      alert("Có lỗi xảy ra khi cập nhật lượt mượn. Vui lòng thử lại.");
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
      <AppHeader title="Chỉnh sửa lượt mượt" />
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
        }}
      />
    </div>
  );
}
