import { z } from "zod";

export type TBookFormValues = z.infer<typeof bookFormSchema>;

export const bookFormSchema = z.object({
  title: z.string().nonempty(),
  genre_id: z.coerce.number().int(), // select box
  author_id: z.coerce.number().int(), // select box
  publisher_id: z.coerce.number().int(), // select box
  price: z.coerce.number().nonnegative().min(1),
  quantity: z.coerce.number().nonnegative().min(1).max(1000),
  total_page: z.coerce.number().nonnegative().min(1).max(1000),
  ISBN: z.string().nonempty(),
  publish_date: z.coerce.date(),
  description: z.string(),
});
