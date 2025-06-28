import { MEMBER_TYPE, MEMBER_TYPE_DISPLAY } from "@/constants/member.enum";

export function displayMemberType(memberType: MEMBER_TYPE): string {
  return MEMBER_TYPE_DISPLAY[memberType as keyof typeof MEMBER_TYPE_DISPLAY] || memberType;
}
