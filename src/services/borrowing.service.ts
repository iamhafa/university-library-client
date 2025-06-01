// /services/borrowing.service.ts
import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";
import { TMember } from "./member.service";
import { BORROWING_STATUS } from "@/constants/borrowing.enum";
import { TBorrowingFormValues } from "@/schemas/borrowing-form.schema";

export type TBorrowing = TBaseEntity & {
  member_id: number;
  status: BORROWING_STATUS;
  borrowing_date: string;
  due_date: string;
  returned_date?: string;
  created_by: string;
  updated_by?: string;
  member?: TMember;
};

export default abstract class BorrowingServiceApi {
  static async create(payload: TBorrowingFormValues): TApiResponse<TBorrowing> {
    const { data } = await api.post("/borrowing", payload);
    return data;
  }

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TBorrowing[]> {
    const { data } = await api.get("/borrowing", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getById(id: string): TApiResponse<TBorrowing> {
    const { data } = await api.get(`/borrowing/${id}`);
    return data;
  }

  static async updateById(id: number | string, updateData: Partial<TBorrowing>): TApiResponse<TBorrowing> {
    const { data } = await api.put(`/borrowing/${id}`, updateData);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TBorrowing> {
    const { data } = await api.delete(`/borrowing/${id}`);
    return data;
  }

  static async returnBook(id?: number | string): TApiResponse<TBorrowing> {
    const { data } = await api.patch(`/borrowing/${id}/return`, {
      returned_date: new Date()
        .toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-"), // Format: dd-mm-yyyy
      status: "RETURNED",
    });
    return data;
  }
}
