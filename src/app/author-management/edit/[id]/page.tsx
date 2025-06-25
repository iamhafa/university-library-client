"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { AuthorForm } from "@/components/forms/author.form";
import AuthorApiService from "@/services/author.service";
import { TAuthorFormValues } from "@/schemas/author-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function UpdateAuthor() {
  const router = useRouter();
  const { id: authorId } = useParams<{ id: string }>();

  const [defaultValues, setDefaultValues] = useState<Partial<TAuthorFormValues>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch author data for editing
  useEffect(() => {
    const fetchAuthorData = async (): Promise<void> => {
      if (!authorId) {
        toast.error("Không tìm thấy ID tác giả!");
        router.push(EAppRouter.AUTHOR_MANAGEMENT_PAGE);
        return;
      }

      try {
        setIsLoading(true);
        const { results, dataPart, error } = await AuthorApiService.getById(authorId);

        if (results === "1") {
          // Set default values for the form
          const authorData: Partial<TAuthorFormValues> = {
            name: dataPart.name,
            bio: dataPart.bio ?? "",
          };

          setDefaultValues(authorData);
        } else {
          toast.error(error || "Không tìm thấy tác giả!");
          router.push(EAppRouter.AUTHOR_MANAGEMENT_PAGE);
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu tác giả!");
        router.push(EAppRouter.AUTHOR_MANAGEMENT_PAGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId, router]);

  const handleSubmit = async (values: TAuthorFormValues): Promise<void> => {
    if (!authorId) {
      toast.error("Không tìm thấy ID tác giả để cập nhật!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { results, error } = await AuthorApiService.updateById(authorId, values);

      if (results === "1") {
        toast.success("Cập nhật tác giả thành công!", { richColors: true });
        router.push(EAppRouter.AUTHOR_MANAGEMENT_PAGE);
      } else {
        toast.error(error || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating author:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tác giả!");
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
        <AppHeader title="Cập nhật tác giả" />
        <div className="p-10">Đang tải dữ liệu tác giả...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Cập nhật tác giả" />
      <AuthorForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        submitButtonText="Cập nhật tác giả"
        isLoading={isSubmitting}
      />
    </div>
  );
}
