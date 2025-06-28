import api from "@/config/api.config";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";
import PaginationDto from "@/helpers/pagination.dto";
import { TMemberFormValues } from "@/schemas/member-form.schema";

export type TMember = TBaseEntity & TMemberFormValues;

export default class MemberServiceApi {
  private static readonly endpoint: string = "/member";

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TMember[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async create(payload: TMember): TApiResponse<TMember> {
    const { data } = await api.post(this.endpoint, payload);
    return data;
  }

  static async getById(id: string): TApiResponse<TMember> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }

  static async updateById(id: string, updateData: Partial<TMember>) {
    const { data } = await api.put(`${this.endpoint}/${id}`, updateData);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TMember> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }
}
