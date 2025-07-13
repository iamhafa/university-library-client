"use client";

import { AppHeader } from "@/components/common/app-header";
import { FineTicketForm } from "@/components/forms/fine-ticket.form";
import { EAppRouter } from "@/constants/app-router.enum";
import { TFineTicketFormValues } from "@/schemas/fine-ticket-form.schema";
import FineTicketApiService from "@/services/fine-ticket.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddFineTicketPage() {
  const router = useRouter();

  const handleSubmit = async (values: TFineTicketFormValues) => {
    try {
      await FineTicketApiService.create(values);
      toast.success("Tạo vé phạt thành công");
      router.push(EAppRouter.FINE_TICKET_MANAGEMENT_PAGE);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Thêm vé phạt mới" sub_title="Điền thông tin để tạo vé phạt mới" />
      <FineTicketForm onSubmit={handleSubmit} onCancel={() => router.back()} submitButtonText="Tạo" />
    </div>
  );
}
