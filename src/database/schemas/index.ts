import { pageVisitsSchema } from "./analytics/pageVisits";
import { guildSettingsSchema } from "./core/guildSettings";
import { levelSettingsSchema } from "./core/levelSettings";
import { projectUpdatesSchema } from "./core/projectUpdates";

export const schemas = [
  guildSettingsSchema,
  levelSettingsSchema,
  pageVisitsSchema,
  projectUpdatesSchema
];