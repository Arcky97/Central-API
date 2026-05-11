import type { TableSchema } from "../../types/schema";

export const guildSettingsSchema: TableSchema = {
  version: 1,
  strict: true, 
  database: "core",
  table: "guildSettings",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    chattingChannel: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    messageLogging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    messageConfig: {
      type: "LONGTEXT",
      default: "NULL"
    },
    memberLogging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    memberConfig: {
      type: "LONGTEXT",
      default: "NULL"
    },
    serverLogging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    serverConfig: {
      type: "LONGTEXT",
      default: "NULL"
    },
    voiceLogging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    voiceConfig: {
      type: "LONGTEXT",
      default: "NULL"
    },
    joinLeaveLogging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    joinLeaveConfig: {
      type: "LONGTEXT",
      default: "NULL"
    },
    moderationLogging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    moderationConfig: {
      type: "LONGTEXT",
      default: "NULL"
    },
    reportLogging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    ignoreLogging: {
      type: "LONGTEXT",
      default: "NULL"
    },
    muteRoles: {
      type: "LONGTEXT",
      default: "NULL"
    },
    joinRoles: {
      type: "LONGTEXT",
      default: "NULL"
    },
    deletionDate: {
      type: "TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_deletion_date",
      columns: ["deletionDate"]
    }
  ]
}