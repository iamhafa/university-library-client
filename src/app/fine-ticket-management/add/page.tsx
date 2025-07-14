"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppHeader } from "@/components/common/app-header";
import { FineTicketForm } from "@/components/forms/fine-ticket.form";
import { EAppRouter } from "@/constants/app-router.enum";
import { FINE_TICKET_PAYMENT_METHOD, FINE_TICKET_STATUS } from "@/constants/fine-ticket.enum";
import { TFineTicketFormValues } from "@/schemas/fine-ticket-form.schema";
import FineTicketApiService from "@/services/fine-ticket.service";

export default function AddFineTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TFineTicketFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { results } = await FineTicketApiService.create(values);

      if (results === "1") {
        toast.success("Tạo vé phạt thành công!", { richColors: true });
        router.push(EAppRouter.FINE_TICKET_MANAGEMENT_PAGE);
      } else {
        toast.error("Tạo vé phạt thất bại!");
      }
    } catch (error) {
      console.error("Error creating publisher:", error);
      toast.error("Có lỗi xảy ra khi tạo vé phạt!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Thêm vé phạt mới" sub_title="Điền thông tin để tạo vé phạt mới" />
      <FineTicketForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(EAppRouter.FINE_TICKET_MANAGEMENT_PAGE)}
        isLoading={isSubmitting}
        defaultValues={{
          status: FINE_TICKET_STATUS.UNPAID,
          payment_method: FINE_TICKET_PAYMENT_METHOD.CASH,
          payment_date: null,
        }}
        submitButtonText="Tạo vé phạt"
      />
    </div>
  );
}
