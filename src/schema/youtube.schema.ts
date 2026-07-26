import { z } from "zod";

export const getYoutubeVideoSchema = z.object({
  videoId: z.string().min(1)
});