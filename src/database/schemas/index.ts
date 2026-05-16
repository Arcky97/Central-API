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
  pageVisitsSchema
];