import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBaseEntity } from "@/types/base-entity.type";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";
import { TAuthorFormValues } from "@/schemas/author-form.schema";

export type TAuthor = TBaseEntity & TAuthorFormValues;

export default abstract class AuthorApiService {
  private static readonly endpoint: string = "/author";

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TAuthor[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async searchByQuery(query: string): TApiResponse<TAuthor> {
    const { data } = await api.get(`${this.endpoint}/search?q=${query}`);
    return data;
  }

  static async getOneById(id: string): TApiResponse<TAuthor> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TAuthor> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }
}
