import { pageVisitsSchema } from "./analytics/pageVisits";
import { botRepliesSchema } from "./core/botReplies";
import { botStatsSchema } from "./core/botStats";
import { doggoBoardPinsSchema } from "./core/doggoBoardPins";
import { doggoBoardSettingsSchema } from "./core/doggoBoardSettings";
import { eventEmbedsSchema } from "./core/eventEmbeds";
import { generatedEmbedsSchema } from "./core/generatedEmbeds";
import { guildLoggingSchema } from "./core/guildLogging";
import { guildSettingsSchema } from "./core/guildSettings";
import { levelEmbedsSchema } from "./core/levelEmbeds";
import { levelSettingsSchema } from "./core/levelSettings";
import { levelSystemSchema } from "./core/levelSystem";
import { infractionsSchema } from "./core/infractions";
import { premiumSubscriptionsSchema } from "./core/premiumSubscriptions";
import { projectUpdatesSchema } from "./core/projectUpdates";
import { reactionRolesSchema } from "./core/reactionRoles";
import { userStatsSchema } from "./core/userStats";
import { apiAuthFailuresSchema } from "./analytics/apiAuthFailures";
import { apiRequestsSchema } from "./analytics/apiRequests";
import { syncJobsSchema } from "./analytics/syncJobs";
import { youtubeChannelsSchema } from "./analytics/youtubeChannels";
import { youtubeChannelSnapshotsSchema } from "./analytics/youtubeChannelSnapshots";
import { youtubeChannelAnalyticsSnapshotsSchema } from "./analytics/youtubeChannelAnalyticsSnapshots";
import { youtubeGoalProfilesSchema } from "./analytics/youtubeGoalProfiles";
import { youtubePlaylistsSchema } from "./analytics/youtubePlaylists";
import { youtubeVideoSnapshotsSchema } from "./analytics/youtubeVideoSnapshots";
import { youtubeVideosSchema } from "./analytics/youtubeVideos";
import { authUsersSchema } from "./auth/authUsers";
import { discordAccountsSchema } from "./auth/discordAccounts";
import { youtubeAccountsSchema } from "./auth/youtubeAccounts";

export const schemas = [
  botRepliesSchema,
  botStatsSchema,
  doggoBoardPinsSchema,
  doggoBoardSettingsSchema,
  eventEmbedsSchema,
  generatedEmbedsSchema,
  guildLoggingSchema,
  guildSettingsSchema,
  infractionsSchema,
  levelEmbedsSchema,
  levelSettingsSchema,
  levelSystemSchema,
  premiumSubscriptionsSchema,
  projectUpdatesSchema,
  reactionRolesSchema,
  userStatsSchema,
  
  apiAuthFailuresSchema,
  apiRequestsSchema,
  syncJobsSchema,
  pageVisitsSchema,

  youtubeChannelsSchema,
  youtubeChannelSnapshotsSchema,
  youtubeChannelAnalyticsSnapshotsSchema,
  youtubeGoalProfilesSchema,
  youtubePlaylistsSchema,
  youtubeVideosSchema,
  youtubeVideoSnapshotsSchema,

  authUsersSchema,
  discordAccountsSchema,
  youtubeAccountsSchema
];