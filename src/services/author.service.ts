import api from "@/config/api.config";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";

export type Author = TBaseEntity & {
  first_name: string;
  last_name: string;
  bio: string;
};

export default abstract class AuthorApiService {
  static async getAll(): TApiPaginationResponse<Author[]> {
    const { data } = await api.get("/author");
    return data;
  }

  static async getOneById(id: string): TApiResponse<Author> {
    const { data } = await api.get(`/author/${id}`);
    return data;
  }
}
