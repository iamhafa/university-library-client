import { TBaseEntity } from "@/types/base-entity.type";

export type TMember = TBaseEntity & {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  member_type: string;
  address: string;
  enrollment_date: string;
};
