import { z } from "zod";

export const getYoutubeVideoSchema = z.object({
  videoId: z.string().min(1)
});

export const getYoutubeSyncSchema = z.object({
  date: z.string().min(1)
})