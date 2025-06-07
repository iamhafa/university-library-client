"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppHeader from "@/components/common/app-header";
import { BorrowingForm } from "@/components/forms/borrowing.form";
import BorrowingServiceApi from "@/services/borrowing.service";
import { TBorrowingFormValues } from "@/schemas/borrowing-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function UpdateBorrowing() {
  const router = useRouter();
  const { id: borrowingId } = useParams<{ id: string }>();

  const [defaultValues, setDefaultValues] = useState<Partial<TBorrowingFormValues>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch borrowing data for editing
  useEffect(() => {
    const fetchBorrowingData = async (): Promise<void> => {
      if (!borrowingId) {
        toast.error("Không tìm thấy ID phiếu mượn!");
        router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
        return;
      }

      try {
        setIsLoading(true);
        const { results, dataPart, error } = await BorrowingServiceApi.getById(borrowingId);

        if (results === "1") {
          // Set default values for the form
          const borrowingData: Partial<TBorrowingFormValues> = {
            member_id: dataPart.member_id,
            status: dataPart.status,
            borrowing_date: dataPart.borrowing_date,
            due_date: dataPart.due_date,
            returned_date: dataPart.returned_date ?? "",
            created_by: dataPart.created_by ?? "",
            updated_by: dataPart.updated_by ?? "",
          };

          setDefaultValues(borrowingData);
        } else {
          toast.error(error || "Không tìm thấy phiếu mượn!");
          router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
        }
      } catch (error) {
        console.error("Error fetching borrowing data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu phiếu mượn!");
        router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowingData();
  }, [borrowingId, router]);

  const handleSubmit = async (values: TBorrowingFormValues): Promise<void> => {
    if (!borrowingId) {
      toast.error("Không tìm thấy ID phiếu mượn để cập nhật!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { results, error } = await BorrowingServiceApi.updateById(borrowingId, values);

      if (results === "1") {
        toast.success("Cập nhật phiếu mượn thành công!", { richColors: true });
        router.push(EAppRouter.BORROWING_MANAGEMENT_PAGE);
      } else {
        toast.error(error || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating borrowing:", error);
      toast.error("Có lỗi xảy ra khi cập nhật phiếu mượn!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto rounded-lg">
        <AppHeader title="Cập nhật phiếu mượn" />
        <div className="p-10">Đang tải dữ liệu phiếu mượn...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Cập nhật phiếu mượn" />
      <BorrowingForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        defaultValues={defaultValues}
        submitButtonText="Cập nhật phiếu mượn"
        isLoading={isSubmitting}
      />
    </div>
  );
}
