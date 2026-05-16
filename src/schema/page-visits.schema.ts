import { z } from "zod";

export const getPageVisitsSchema = z.object({
  path: z.string(),
  ip: z.string(),
  userAgent: z.string().nullable().optional(),
  referrer: z.string().nullable().optional()
});