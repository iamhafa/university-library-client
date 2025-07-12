
// pages/add-publisher/page.tsx
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { PublisherForm } from "@/components/forms/publisher.form";
import PublisherApiService from "@/services/publisher.service";
import { TPublisherFormValues } from "@/schemas/publisher-form.schema";

export default function AddPublisher() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TPublisherFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const results = await PublisherApiService.create(values);

      if (results) {
        toast.success("Tạo nhà xuất bản thành công!", { richColors: true });
        router.push(EAppRouter.PUBLISHER_MANAGEMENT_PAGE);
      } else {
        toast.error("Tạo nhà xuất bản thất bại!");
      }
    } catch (error) {
      console.error("Error creating publisher:", error);
      toast.error("Có lỗi xảy ra khi tạo nhà xuất bản!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Thêm nhà xuất bản mới" />
      <PublisherForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(EAppRouter.PUBLISHER_MANAGEMENT_PAGE)}
        isLoading={isSubmitting}
        submitButtonText="Lưu nhà xuất bản"
      />
    </div>
  );
}
