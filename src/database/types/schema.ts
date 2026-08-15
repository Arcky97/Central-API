export type DatabaseName =
  | "core"
  | "analytics"
  | "auth";

export type TableName = 
  | "apiAuthFailures"
  | "apiRequests"
  | "botReplies"
  | "botStats"
  | "doggoBoardPins"
  | "doggoBoardSettings"
  | "eventEmbeds"
  | "generatedEmbeds"
  | "guildLogging"
  | "guildSettings"
  | "infractions"
  | "levelEmbeds"
  | "levelSettings"
  | "levelSystem"
  | "pageVisits"
  | "premiumSubscriptions"
  | "projectUpdates"
  | "reactionRoles"
  | "userStats"
  | "youtubeChannels"
  | "youtubeGoalProfiles"
  | "youtubeVideoSnapshots"
  | "youtubeVideos"
  | "authUser"
  | "youtubeAccounts"
  | "discordAccounts"

export interface SchemaColumn {
  type: string;
  nullable?: boolean;
  default?: string;
  unsigned?: boolean;
  autoIncrement?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  onUpdate?: string;
}

export interface SchemaIndex {
  name: string;
  columns: string[];
  unique?: boolean;
}

export interface TableSchema {
  version: number;
  strict?: boolean;

  database: DatabaseName;
  table: string;

  columns: Record<string, SchemaColumn>;

  indexes?: SchemaIndex[];
}