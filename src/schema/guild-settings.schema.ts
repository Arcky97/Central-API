import { z } from "zod";

export const getGuildSettingsSchema = z.object({
  guildId: z.string().min(1).max(20),
  logging: z.boolean().default(false),
  leveling: z.boolean().default(true),
  doggoBoard: z.boolean().default(false),
  reactionRoles: z.boolean().default(false),
  deletionDate: z.coerce.date().optional()
});