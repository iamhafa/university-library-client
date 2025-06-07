"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { BookForm } from "@/components/forms/book.form";
import BookServiceApi from "@/services/book.service";
import { TBookFormValues } from "@/schemas/book-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function UpdateBook() {
  const router = useRouter();
  const { id: bookId } = useParams<{ id: string }>();

  const [defaultValues, setDefaultValues] = useState<Partial<TBookFormValues>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch book data for editing
  useEffect(() => {
    const fetchBookData = async (): Promise<void> => {
      if (!bookId) {
        toast.error("Không tìm thấy ID sách!");
        router.push(EAppRouter.BOOK_MANGEMENT_PAGE);
        return;
      }

      try {
        setIsLoading(true);
        const { results, dataPart, error } = await BookServiceApi.getById(bookId);

        if (results === "1") {
          const authorIds = dataPart.book_author_items
            ?.map((item) => item.author?.id)
            .filter((id): id is number => id !== undefined);

          // Set default values for the form
          const bookData: Partial<TBookFormValues> = {
            title: dataPart.title,
            genre_id: dataPart.genre_id,
            author_ids: authorIds, // Array of author IDs
            publisher_id: dataPart.publisher_id,
            price: dataPart.price,
            quantity: dataPart.quantity,
            total_page: dataPart.total_page,
            ISBN: dataPart.ISBN,
            image_url: dataPart.image_url ?? "",
            publish_date: dataPart.publish_date,
            description: dataPart.description ?? "",
          };

          setDefaultValues(bookData);
        } else {
          toast.error(error || "Không tìm thấy sách!");
          router.push(EAppRouter.BOOK_MANGEMENT_PAGE);
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu sách!");
        router.push(EAppRouter.BOOK_MANGEMENT_PAGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
  }, [bookId, router]);

  const handleSubmit = async (values: TBookFormValues): Promise<void> => {
    if (!bookId) {
      toast.error("Không tìm thấy ID sách để cập nhật!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { results, error } = await BookServiceApi.updateById(bookId, values);

      if (results === "1") {
        toast.success("Cập nhật sách thành công!", { richColors: true });
        router.push(EAppRouter.BOOK_MANGEMENT_PAGE);
      } else {
        toast.error(error || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Có lỗi xảy ra khi cập nhật sách!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="mx-auto rounded-lg">
        <AppHeader title="Cập nhật sách" />
        <div className="p-10">Đang tải dữ liệu sách...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Cập nhật sách" />
      <BookForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        submitButtonText="Cập nhật sách"
        isLoading={isSubmitting}
      />
    </div>
  );
}
