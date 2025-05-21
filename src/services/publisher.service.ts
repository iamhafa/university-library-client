import api from "@/config/api.config";
import PaginationDto from "@/helpers/pagination.dto";
import { TApiPaginationResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";

export type Publisher = TBaseEntity & {
  name: string;
  address: string;
  contact_number: string;
};

export default abstract class PublisherApiService {
  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<Publisher[]> {
    const { data } = await api.get("/publisher", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }
}
