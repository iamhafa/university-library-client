import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBaseEntity } from "@/types/base-entity.type";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";

export type Genre = TBaseEntity & {
  name: string;
};

export default abstract class GenreApiService {
  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<Genre[]> {
    const { data } = await api.get("/genre", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getOneById(id: string): TApiResponse<Genre> {
    const { data } = await api.get(`/genre/${id}`);
    return data;
  }
}
