import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TApiPaginationResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";

export type TPublisher = TBaseEntity & {
  name: string;
  address: string;
  contact_number: string;
};

export default abstract class PublisherApiService {
  private static readonly endpoint: string = "/publisher";

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TPublisher[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  static async getById(id: string): Promise<TPublisher> {
    const { data } = await api.get(`${this.endpoint}/${id}`);
    return data;
  }

  static async create(publisher: TPublisher): Promise<TPublisher> {
    const { data } = await api.post(this.endpoint, publisher);
    return data;
  }

  static async updateById(id: string, publisher: TPublisher): Promise<TPublisher> {
    const { data } = await api.put(`${this.endpoint}/${id}`, publisher);
    return data;
  }

  static async deleteById(id?: number): Promise<{ results: string }> {
    const { data } = await api.delete(`${this.endpoint}/${id}`);
    return data;
  }
}
