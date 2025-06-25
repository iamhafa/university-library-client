// pages/add-book/page.tsx
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import AuthorApiService from "@/services/author.service";
import { TAuthorFormValues } from "@/schemas/author-form.schema";
import { AuthorForm } from "@/components/forms/author.form";

export default function AddAuthor() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TAuthorFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { results, error } = await AuthorApiService.create(values);

      if (results === "1") {
        toast.success("Tạo tác giả thành công!", { richColors: true });
        router.push(EAppRouter.AUTHOR_MANAGEMENT_PAGE);
      } else {
        toast.error(error || "Tạo tác giả thất bại!");
      }
    } catch (error) {
      console.error("Error creating author:", error);
      toast.error("Có lỗi xảy ra khi tạo tác giả!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Thêm tác giả mới" />
      <AuthorForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(EAppRouter.AUTHOR_MANAGEMENT_PAGE)}
        submitButtonText="Lưu tác giả"
        isLoading={isSubmitting}
      />
    </div>
  );
}
