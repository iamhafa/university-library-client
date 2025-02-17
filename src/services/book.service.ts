import api from "@/config/api.config";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";

export type Book = TBaseEntity & {
  id: number;
  title: string;
  ISBN: string;
  price: number;
  total_page: number;
  quantity: string;
  publish_date: string;
  description: string;
  author_id: number;
  genre_id: number;
  publisher_id: number;
};

export default abstract class BookServiceApi {
  static async getAlls(): TApiPaginationResponse<Book[]> {
    const { data } = await api.get("/book");
    return data;
  }

  static async getOneById(id: string): TApiResponse<Book> {
    const { data } = await api.get(`/book/${id}`);
    return data;
  }
}
