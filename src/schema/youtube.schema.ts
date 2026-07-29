import { z } from "zod";

export const getYoutubeVideoSchema = z.object({
  videoId: z.string().min(1)
});

export const getYoutubeSyncSchema = z.object({
  date: z.string().min(1)
})

export const getYoutubeVideoUpdateSchema = z.object({
  videoId: z.string().min(1),
  goalProfileId: z.number().nullable().optional(),
  series: z.string().min(1).nullable().optional(),
  episodeNumber: z.number().nullable().optional(),
  trackAnalytics: z.boolean().optional()
})