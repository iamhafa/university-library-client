// pages/add-book/page.tsx
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { BookForm } from "@/components/forms/book.form";
import BookServiceApi from "@/services/book.service";
import { TBookFormValues } from "@/schemas/book-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function AddBook() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TBookFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { results, error } = await BookServiceApi.create(values);

      if (results === "1") {
        toast.success("Tạo sách thành công!", { richColors: true });
        router.push(EAppRouter.BOOK_MANGEMENT_PAGE);
      } else {
        toast.error(error || "Tạo sách thất bại!");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Có lỗi xảy ra khi tạo sách!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Thêm sách mới" />
      <BookForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(EAppRouter.BOOK_MANGEMENT_PAGE)}
        submitButtonText="Lưu sách"
        isLoading={isSubmitting}
      />
    </div>
  );
}
