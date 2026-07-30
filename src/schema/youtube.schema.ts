import { z } from "zod";

export const getYoutubeVideoSchema = z.object({
  videoId: z.string().min(1)
});

export const getYoutubeSyncSchema = z.object({
  date: z.string().min(1)
})

export const getYoutubeVideoUpdateSchema = z.object({
  goalProfileId: z.number().nullable().optional(),
  series: z.string().min(1).nullable().optional(),
  episodeNumber: z.number().nullable().optional(),
  trackAnalytics: z.boolean().optional()
})

export const getGoalProfileSchema = z.object({
  goalProfileId: z.coerce.number().int().positive()
});

export const getGoalProfileUpdateSchema = z.object({
  name: z.string().min(1),
  goalViews: z.number(),
  goalWatchhours: z.number().nullable().optional(),
  goalLikes: z.number().nullable().optional(),
  goalComments: z.number().nullable().optional()
})