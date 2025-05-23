import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";
import { Publisher } from "./publisher.service";
import { Genre } from "./genre.service";

export type Book = TBaseEntity & {
  title: string;
  author_id: number;
  genre_id: number;
  publisher_id: number;
  price: number;
  ISBN: string;
  image_url: string;
  total_page: number;
  quantity: number;
  publish_date: string;
  description: string;
  genre?: Genre;
  publisher?: Publisher;
};

export default abstract class BookServiceApi {
  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<Book[]> {
    const { data } = await api.get("/book", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getOneById(id: string): TApiResponse<Book> {
    const { data } = await api.get(`/book/${id}`);
    return data;
  }

  static async create(payload: Book): TApiResponse<Book> {
    const { data } = await api.post("/book", payload);
    return data;
  }
}
