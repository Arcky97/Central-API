import z from "zod";

export const getBotRepliesSchema = z.object({
  uuid: z.string().min(1).max(11),
  trigger: z.string(),
  responses: z.array(
    z.record(
      z.string(),
      z.union([
        z.string(),
        z.array(
          z.string())
      ])
    )
  ),
  limit: z.coerce.number().int().min(1).max(100)
});