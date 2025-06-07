import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBorrowingItemsFormValues } from "@/schemas/borrowing-form.schema";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";

export type TBorrowingItems = TBaseEntity & {
  book_id: number;
  borrowing_id: number;
  quantity: number;
  price: number;
  returned_date: string;
};

export abstract class BorrowingItemsService {
  private static readonly endpoint: string = "/borrowing/items";

  static async create(payload: TBorrowingItemsFormValues): TApiResponse<TBorrowingItems> {
    const { data } = await api.post(this.endpoint, payload);
    return data;
  }

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TBorrowingItems[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getByBorrowingId(borrowingId: number): TApiResponse<TBorrowingItems[]> {
    const { data } = await api.get(`${this.endpoint}/${borrowingId}`);
    return data;
  }
}
