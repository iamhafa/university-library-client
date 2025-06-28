"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/common/app-header";
import { MemberForm } from "@/components/forms/member.form";
import MemberApiService from "@/services/member.service";
import { TMemberFormValues } from "@/schemas/member-form.schema";
import { EAppRouter } from "@/constants/app-router.enum";

export default function EditMember() {
  const router = useRouter();
  const { id: memberId } = useParams<{ id: string }>();

  const [defaultValues, setDefaultValues] = useState<Partial<TMemberFormValues>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch member data for editing
  useEffect(() => {
    const fetchMemberData = async (): Promise<void> => {
      if (!memberId) {
        toast.error("Không tìm thấy ID thành viên!");
        router.push(EAppRouter.MEMBER_MANAGEMENT_PAGE);
        return;
      }

      try {
        setIsLoading(true);
        const { results, dataPart, error } = await MemberApiService.getById(memberId);

        if (results === "1") {
          // Set default values for the form
          const memberData: Partial<TMemberFormValues> = {
            name: dataPart.name,
            email: dataPart.email,
            phone_number: dataPart.phone_number,
            member_type: dataPart.member_type,
            address: dataPart.address,
            enrollment_date: dataPart.enrollment_date,
          };

          setDefaultValues(memberData);
        } else {
          toast.error(error || "Không tìm thấy thành viên!");
          router.push(EAppRouter.MEMBER_MANAGEMENT_PAGE);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu thành viên!");
        router.push(EAppRouter.MEMBER_MANAGEMENT_PAGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId, router]);

  const handleSubmit = async (values: TMemberFormValues): Promise<void> => {
    if (!memberId) {
      toast.error("Không tìm thấy ID thành viên để cập nhật!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { results, error } = await MemberApiService.updateById(memberId, values);

      if (results === "1") {
        toast.success("Cập nhật thành viên thành công!", { richColors: true });
        router.push(EAppRouter.MEMBER_MANAGEMENT_PAGE);
      } else {
        toast.error(error || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thành viên!");
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
        <AppHeader title="Cập nhật thành viên" />
        <div className="p-10">Đang tải dữ liệu thành viên...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto rounded-lg">
      <AppHeader title="Cập nhật thành viên" />
      <MemberForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        submitButtonText="Cập nhật thành viên"
        isLoading={isSubmitting}
      />
    </div>
  );
}
