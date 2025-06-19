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
  returned_date?: string | null;
  created_by: string;
  updated_by?: string;
  member?: TMember;
};

export default abstract class BorrowingServiceApi {
  private static readonly endpoint: string = "/borrowing";

  static async create(payload: TBorrowingFormValues): TApiResponse<TBorrowing> {
    const { data } = await api.post(this.endpoint, payload);
    return data;
  }

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TBorrowing[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getById(id: string | number): TApiResponse<TBorrowing> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }

  static async updateById(id: string | number, updateData: Partial<TBorrowing>): TApiResponse<TBorrowing> {
    const { data } = await api.put(`${this.endpoint}/${id}`, updateData);
    return data;
  }

  static async deleteById(id?: string | number): TApiResponse<TBorrowing> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }

  static async returnBook(id?: string | number): TApiResponse<TBorrowing> {
    const { data } = await api.patch(`${this.endpoint}/${id}/return`);
    return data;
  }
}
