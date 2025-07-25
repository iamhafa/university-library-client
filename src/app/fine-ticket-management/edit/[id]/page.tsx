"use client";

import { AppHeader } from "@/components/common/app-header";
import { FineTicketForm } from "@/components/forms/fine-ticket.form";
import { EAppRouter } from "@/constants/app-router.enum";
import { TFineTicketFormValues } from "@/schemas/fine-ticket-form.schema";
import FineTicketApiService, { TFineTicket } from "@/services/fine-ticket.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditFineTicketPage() {
  const router = useRouter();
  const { id: fineTicketId } = useParams<{ id: string }>();
  const [fineTicket, setFineTicket] = useState<TFineTicket>();

  useEffect(() => {
    const fetchFineTicket = async () => {
      try {
        const { dataPart } = await FineTicketApiService.getById(fineTicketId);
        setFineTicket(dataPart);
        // console.log(dataPart);
      } catch (error) {
        toast.error("Không tìm thấy vé phạt");
        router.push(EAppRouter.FINE_TICKET_MANAGEMENT_PAGE);
      }
    };

    fetchFineTicket();
  }, [fineTicketId, router]);

  console.log(fineTicket);

  const handleSubmit = async (values: TFineTicketFormValues) => {
    try {
      await FineTicketApiService.updateById(fineTicketId, values);
      toast.success("Cập nhật vé phạt thành công");
      router.push(EAppRouter.FINE_TICKET_MANAGEMENT_PAGE);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <AppHeader title="Chỉnh sửa vé phạt" sub_title="Chỉnh sửa thông tin vé phạt" />
      <FineTicketForm onSubmit={handleSubmit} onCancel={() => router.back()} submitButtonText="Lưu" defaultValues={fineTicket} />
    </div>
  );
}
