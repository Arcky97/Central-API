import z from "zod";

export const getBotStatsSchema = z.object({
  guildId: z.string().min(1).max(20),
  totalCount: z.array(z.record(z.string(), z.string())),
  eventCount: z.array(z.record(z.string(), z.string())),
  commandCount: z.array(z.record(z.string(), z.string())),
  levelSystemCount: z.array(z.record(z.string(), z.string()))
});