import { z } from "zod";

export const getYoutubeVideoSchema = z.object({
  videoId: z.string().min(1)
});

export const getYoutubeSyncSchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
    .refine(value => {
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
    }, "Date is invalid")
    .refine(value => value <= new Date().toISOString().slice(0, 10), "Date cannot be in the future")
    .refine(value => {
      const minimum = new Date();
      minimum.setUTCFullYear(minimum.getUTCFullYear() - 5);
      return value >= minimum.toISOString().slice(0, 10);
    }, "Backfill range cannot exceed five years")
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
  goalWatchHours: z.number().nullable().optional(),
  goalLikes: z.number().nullable().optional(),
  goalComments: z.number().nullable().optional()
})