import { z } from "zod";

export const getProjectUpdatesSchema = z.object({
  project: z.string(),
  date: z.coerce.date(),
  title: z.string(),
  excerpt: z.string(),
  slug: z.string()
});