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
}
