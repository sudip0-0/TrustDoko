import { z } from "zod";

export const businessListSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
});

export type BusinessListSearch = z.infer<typeof businessListSearchSchema>;

export const BUSINESS_LIST_PAGE_SIZE = 12;
