import { nullable, z } from "zod";

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
    // No minimum: videos are always fetched from all time, analytics/snapshots are clamped
    // to the retention window server-side in YoutubeSyncService regardless of this date.
});

export const getYoutubeVideoSyncSchema = z.object({
  videoId: z.string().min(1),
  date: z.string().nullable().optional()
});

export const getYoutubeVideoUpdateSchema = z.object({
  goalProfileId: z.number().nullable().optional(),
  trackAnalytics: z.boolean().optional()
})

export const getGoalAllProfilesSchema = z.object({
  channelId: z.string().min(1)
})

export const getGoalProfileSchema = z.object({
  goalProfileId: z.coerce.number().int().positive()
});

export const getGoalProfileUpdateSchema = z.object({
  name: z.string().min(1),
  views: z.number(),
  watchHours: z.number().nullable().optional(),
  likes: z.number().nullable().optional(),
  comments: z.number().nullable().optional()
})