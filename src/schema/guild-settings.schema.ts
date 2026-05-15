import { z } from "zod";

export const getGuildSettingsSchema = z.object({
  guildId: z.string().min(1).max(20)
});