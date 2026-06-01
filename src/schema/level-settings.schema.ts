import z from "zod";


export const getLevelSettingsSchema = z.object({
  guildId: z.string().min(1).max(20),

  deletionDate: z.coerce.date().optional()
});