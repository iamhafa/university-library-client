// pages/add-book/page.tsx
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { EAppRouter } from "@/constants/app-router.enum";
import { MemberForm } from "@/components/forms/member.form";
import MemberServiceApi from "@/services/member.service";
import { TMemberFormValues } from "@/schemas/member-form.schema";

export default function AddMember() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: TMemberFormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      const { results, error } = await MemberServiceApi.create(values);

      if (results === "1") {
        toast.success("Tạo thành viên thành công!", { richColors: true });
        router.push(EAppRouter.MEMBER_MANAGEMENT_PAGE);
      } else {
        toast.error(error || "Tạo thành viên thất bại!");
      }
    } catch (error) {
      console.error("Error creating genre:", error);
      toast.error("Có lỗi xảy ra khi tạo thành viên!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Thêm thành viên mới" />
      <MemberForm
        onSubmit={handleSubmit}
        onCancel={() => router.push(EAppRouter.MEMBER_MANAGEMENT_PAGE)}
        isLoading={isSubmitting}
        submitButtonText="Lưu thành viên"
      />
    </div>
  );
}
