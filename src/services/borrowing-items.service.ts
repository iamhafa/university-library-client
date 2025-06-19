import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TBorrowingItemsFormValues } from "@/schemas/borrowing-form.schema";
import { TApiPaginationResponse, TApiResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";

export type TBorrowingItems = TBaseEntity & {
  book_id: number;
  borrowing_id: string;
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

  static async getByBorrowingId(borrowingId: string): TApiResponse<TBorrowingItems[]> {
    // Fixed endpoint - removed extra 'borrowing' prefix
    const { data } = await api.get(`/borrowing/${borrowingId}/items`);
    return data;
  }

  static async createBulk(borrowingId: number, items: TBorrowingItemsFormValues[]): TApiResponse<TBorrowingItems[]> {
    const { data } = await api.post(`${this.endpoint}/bulk-create`, {
      borrowing_id: borrowingId,
      items,
    });
    return data;
  }

  static async updateBulk(borrowingId: string, items: TBorrowingItemsFormValues[]): TApiResponse<TBorrowingItems[]> {
    const { data } = await api.put(`/borrowing/${borrowingId}/items/bulk-update`, {
      items,
    });
    return data;
  }

  static async deleteByBorrowingId(borrowingId: string): TApiResponse<void> {
    const { data } = await api.delete(`/borrowing/${borrowingId}/items`);
    return data;
  }

  static async deleteById(id: string | number): TApiResponse<void> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }
}
