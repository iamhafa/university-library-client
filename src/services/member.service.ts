import api from "@/config/api.config";
import { TApiPaginationResponse } from "@/types/api-reponse.type";
import { TBaseEntity } from "@/types/base-entity.type";
import PaginationDto from "@/helpers/pagination.dto";

export type TMember = TBaseEntity & {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  member_type: string;
  address: string;
  enrollment_date: string;
};

export default class MemberServiceApi {
  private static readonly endpoint: string = "/member";

  static async getAll({ page, limit }: PaginationDto): TApiPaginationResponse<TMember[]> {
    const { data } = await api.get(this.endpoint, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }
}
