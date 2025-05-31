import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";
import { Publisher } from "./publisher.service";
import { Genre } from "./genre.service";
import { TAuthor } from "./author.service";

export type TBookAuthorItems = TBaseEntity & {
  book_id: number;
  author_id: number;
  author: TAuthor;
};

export type TBook = TBaseEntity & {
  title: string;
  author_ids: number[];
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
  book_author_items?: TBookAuthorItems[];
};

export default abstract class BookServiceApi {
  static async create(payload: TBook): TApiResponse<TBook> {
    const { data } = await api.post("/book", payload);
    return data;
  }

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TBook[]> {
    const { data } = await api.get("/book", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getById(id: string): TApiResponse<TBook> {
    const { data } = await api.get(`/book/${id}`);
    return data;
  }

  static async updateById(id: number | string, updateData: Partial<TBook>): TApiResponse<TBook> {
    const { data } = await api.put(`/book/${id}`, updateData);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TBook> {
    const { data } = await api.delete(`/book/${id}`);
    return data;
  }
}
