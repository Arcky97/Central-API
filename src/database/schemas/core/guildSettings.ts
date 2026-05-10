import type { TableSchema } from "../../types/schema";

export const guildSettingsSchema: TableSchema = {
  version: 1,
  strict: true, 
  database: "core",
  table: "guild_settings",
  columns: {
    guild_id: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    chatting_channel: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    message_logging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    message_config: {
      type: "LONGTEXT",
      default: "NULL"
    },
    member_logging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    member_config: {
      type: "LONGTEXT",
      default: "NULL"
    },
    server_logging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    server_config: {
      type: "LONGTEXT",
      default: "NULL"
    },
    voice_logging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    voice_config: {
      type: "LONGTEXT",
      default: "NULL"
    },
    join_leave_logging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    join_leave_config: {
      type: "LONGTEXT",
      default: "NULL"
    },
    moderation_logging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    moderation_config: {
      type: "LONGTEXT",
      default: "NULL"
    },
    report_logging: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    ignore_logging: {
      type: "LONGTEXT",
      default: "NULL"
    },
    mute_roles: {
      type: "LONGTEXT",
      default: "NULL"
    },
    join_roles: {
      type: "LONGTEXT",
      default: "NULL"
    },
    deletion_date: {
      type: "TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_deletion_date",
      columns: ["deletion_date"]
    }
  ]
}