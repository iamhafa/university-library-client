"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { GenreForm } from "@/components/forms/genre.form";
import GenreApiService from "@/services/genre.service";
import { TGenreFormValues } from "@/schemas/genre-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function EditGenre() {
  const router = useRouter();
  const { id: genreId } = useParams<{ id: string }>();

  const [defaultValues, setDefaultValues] = useState<Partial<TGenreFormValues>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch genre data for editing
  useEffect(() => {
    const fetchGenreData = async (): Promise<void> => {
      if (!genreId) {
        toast.error("Không tìm thấy ID thể loại!");
        router.push(EAppRouter.GENRE_MANGEMENT_PAGE);
        return;
      }

      try {
        setIsLoading(true);
        const { results, dataPart, error } = await GenreApiService.getById(genreId);

        if (results === "1") {
          // Set default values for the form
          const genreData: Partial<TGenreFormValues> = {
            name: dataPart.name,
          };

          setDefaultValues(genreData);
        } else {
          toast.error(error || "Không tìm thấy thể loại!");
          router.push(EAppRouter.GENRE_MANGEMENT_PAGE);
        }
      } catch (error) {
        console.error("Error fetching genre data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu thể loại!");
        router.push(EAppRouter.GENRE_MANGEMENT_PAGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenreData();
  }, [genreId, router]);

  const handleSubmit = async (values: TGenreFormValues): Promise<void> => {
    if (!genreId) {
      toast.error("Không tìm thấy ID thể loại để cập nhật!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { results, error } = await GenreApiService.updateById(genreId, values);

      if (results === "1") {
        toast.success("Cập nhật thể loại thành công!", { richColors: true });
        router.push(EAppRouter.GENRE_MANGEMENT_PAGE);
      } else {
        toast.error(error || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating genre:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thể loại!");
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
        <AppHeader title="Cập nhật thể loại" />
        <div className="p-10">Đang tải dữ liệu thể loại...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Cập nhật thể loại" />
      <GenreForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        submitButtonText="Cập nhật thể loại"
        isLoading={isSubmitting}
      />
    </div>
  );
}
