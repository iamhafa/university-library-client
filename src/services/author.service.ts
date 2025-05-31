import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBaseEntity } from "@/types/base-entity.type";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";

export type TAuthor = TBaseEntity & {
  name: string;
  bio: string;
};

export default abstract class AuthorApiService {
  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TAuthor[]> {
    const { data } = await api.get("/author", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async searchByQuery(query: string): TApiResponse<TAuthor> {
    const { data } = await api.get(`/author/search?q=${query}`);
    return data;
  }

  static async getOneById(id: string): TApiResponse<TAuthor> {
    const { data } = await api.get(`/author/${id}`);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TAuthor> {
    const { data } = await api.delete(`/author/${id}`);
    return data;
  }
}
