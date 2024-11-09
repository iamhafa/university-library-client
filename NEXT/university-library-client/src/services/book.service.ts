import api from "@/config/api.config";
import { TBaseEntity } from "@/types/base-entity.type";
import { AxiosResponse } from "axios";

export type Book = TBaseEntity & {
  id: number;
  title: string;
  ISBN: string;
  price: number;
  totalPage: number;
  quantity: string;
  publishedDate: string;
  description: string;
  authorId: number;
  genreId: number;
  publisherId: number;
};

export default abstract class BookServiceApi {
  static getAlls(): Promise<AxiosResponse<Book[]>> {
    return api.get("/book");
  }

  static getOneById(id: string): Promise<AxiosResponse<Book>> {
    return api.get(`/book/${id}`);
  }
}
