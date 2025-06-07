import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBaseEntity } from "@/types/base-entity.type";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";

export type TGenre = TBaseEntity & {
  name: string;
};

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

  static async getOneById(id: string): TApiResponse<TGenre> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }
}
