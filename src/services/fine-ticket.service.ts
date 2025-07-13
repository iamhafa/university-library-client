import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TApiResponse, TApiPaginationResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";
import { TFineTicketFormValues } from "@/schemas/fine-ticket-form.schema";

export type TFineTicket = TBaseEntity & TFineTicketFormValues;

export default abstract class FineTicketApiService {
  private static readonly endpoint: string = "/fine-ticket";

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TFineTicket[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async create(payload: TFineTicket): TApiResponse<TFineTicket> {
    const { data } = await api.post(this.endpoint, payload);
    return data;
  }

  static async getById(id: string): TApiResponse<TFineTicket> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }

  static async updateById(id: string, updateData: Partial<TFineTicket>) {
    const { data } = await api.put(`${this.endpoint}/${id}`, updateData);
    return data;
  }

  static async deleteById(id?: number): TApiResponse<TFineTicket> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }
}
