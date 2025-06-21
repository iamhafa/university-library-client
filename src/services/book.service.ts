import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";
import { TPublisher } from "./publisher.service";
import { TGenre } from "./genre.service";
import { TAuthor } from "./author.service";
import { TBookFormValues } from "@/schemas/book-form.schema";

export type TBookAuthorItems = TBaseEntity & {
  book_id: number;
  author_id: number;
  author: TAuthor;
};

export type TBook = TBaseEntity &
  TBookFormValues & {
    genre?: TGenre;
    publisher?: TPublisher;
    book_author_items?: TBookAuthorItems[];
  };

export default abstract class BookServiceApi {
  private static readonly endpoint: string = "/book";

  static async create(payload: TBook): TApiResponse<TBook> {
    const { data } = await api.post(this.endpoint, payload);
    return data;
  }

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TBook[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getById(id: string): TApiResponse<TBook> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }

  static async updateById(id: number | string, updateData: Partial<TBook>): TApiResponse<TBook> {
    const { data } = await api.put(`${this.endpoint}/${id}`, updateData);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TBook> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }
}
