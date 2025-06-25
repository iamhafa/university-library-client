// pages/add-book/page.tsx
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import GenreApiService from "@/services/genre.service";
import { TGenreFormValues } from "@/schemas/genre-form.schema";
import { GenreForm } from "@/components/forms/genre.form";

export default function AddGenre() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TGenreFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { results, error } = await GenreApiService.create(values);

      if (results === "1") {
        toast.success("Tạo tác giả thành công!", { richColors: true });
        router.push(EAppRouter.AUTHOR_MANAGEMENT_PAGE);
      } else {
        toast.error(error || "Tạo tác giả thất bại!");
      }
    } catch (error) {
      console.error("Error creating genre:", error);
      toast.error("Có lỗi xảy ra khi tạo tác giả!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Thêm thể loại sách mới" />
      <GenreForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(EAppRouter.GENRE_MANGEMENT_PAGE)}
        submitButtonText="Lưu thể loại"
        isLoading={isSubmitting}
      />
    </div>
  );
}
