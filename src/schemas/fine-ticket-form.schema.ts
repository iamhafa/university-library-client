import { z } from "zod";
import { FINE_TICKET_PAYMENT_METHOD, FINE_TICKET_STATUS } from "@/constants/fine-ticket.enum";

export type TFineTicketFormValues = z.infer<typeof fineTicketFormSchema>;

export const fineTicketFormSchema = z.object({
  borrowing_id: z.string(),
  total_fine_amount: z.number(),
  status: z.nativeEnum(FINE_TICKET_STATUS),
  payment_method: z.nativeEnum(FINE_TICKET_PAYMENT_METHOD),
  payment_date: z.string().nullable(),
});
