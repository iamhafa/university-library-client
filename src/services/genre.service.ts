import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBaseEntity } from "@/types/base-entity.type";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";
import { TGenreFormValues } from "@/schemas/genre-form.schema";

export type TGenre = TBaseEntity & TGenreFormValues;

export default abstract class GenreApiService {
  private static readonly endpoint: string = "/genre";

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TGenre[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getById(id: string): TApiResponse<TGenre> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }

  static async create(payload: TGenre): TApiResponse<TGenre> {
    const { data } = await api.post(this.endpoint, payload);
    return data;
  }

  static async updateById(id: string, updateData: Partial<TGenre>) {
    const { data } = await api.put(`${this.endpoint}/${id}`, updateData);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TGenre> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }
}
