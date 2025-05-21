import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBaseEntity } from "@/types/base-entity.type";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";

export type Author = TBaseEntity & {
  name: string;
  bio: string;
};

export default abstract class AuthorApiService {
  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<Author[]> {
    const { data } = await api.get("/author", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async searchByQuery(query: string): TApiResponse<Author> {
    const { data } = await api.get(`/author/search?q=${query}`);
    return data;
  }

  static async getOneById(id: string): TApiResponse<Author> {
    const { data } = await api.get(`/author/${id}`);
    return data;
  }
}
