"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { PublisherForm } from "@/components/forms/publisher.form";
import PublisherApiService from "@/services/publisher.service";
import { TPublisherFormValues } from "@/schemas/publisher-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function EditPublisher() {
  const router = useRouter();
  const { id: publisherId } = useParams<{ id: string }>();

  const [defaultValues, setDefaultValues] = useState<Partial<TPublisherFormValues>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPublisherData = async (): Promise<void> => {
      if (!publisherId) {
        toast.error("Không tìm thấy ID nhà xuất bản!");
        router.push(EAppRouter.PUBLISHER_MANAGEMENT_PAGE);
        return;
      }

      try {
        setIsLoading(true);
        const { results, dataPart } = await PublisherApiService.getById(publisherId);

        if (results === "1") {
          const formValues: Partial<TPublisherFormValues> = {
            name: dataPart.name,
            address: dataPart.address,
            contact_number: dataPart.contact_number,
          };
          setDefaultValues(formValues);
        } else {
          toast.error("Không tìm thấy nhà xuất bản!");
          router.push(EAppRouter.PUBLISHER_MANAGEMENT_PAGE);
        }
      } catch (error) {
        console.error("Error fetching publisher data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu nhà xuất bản!");
        router.push(EAppRouter.PUBLISHER_MANAGEMENT_PAGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublisherData();
  }, [publisherId, router]);

  const handleSubmit = async (values: TPublisherFormValues): Promise<void> => {
    if (!publisherId) {
      toast.error("Không tìm thấy ID nhà xuất bản để cập nhật!");
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedPublisher = await PublisherApiService.updateById(publisherId, values);

      if (updatedPublisher) {
        toast.success("Cập nhật nhà xuất bản thành công!", { richColors: true });
        router.push(EAppRouter.PUBLISHER_MANAGEMENT_PAGE);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating publisher:", error);
      toast.error("Có lỗi xảy ra khi cập nhật nhà xuất bản!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto rounded-lg">
        <AppHeader title="Cập nhật nhà xuất bản" />
        <div className="p-10">Đang tải dữ liệu nhà xuất bản...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Cập nhật nhà xuất bản" />
      <PublisherForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        defaultValues={defaultValues}
        submitButtonText="Cập nhật nhà xuất bản"
        isLoading={isSubmitting}
      />
    </div>
  );
}
