import { TableSchema } from "../../types/schema";

export const levelSettingsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "levelSettings",
  columns: {
    guild_id: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    global_multiplier: {
      type: "INT(10)",
      default: "100"
    },
    level_roles: {
      type: "LONGTEXT",
      default: "NULL"
    },
    roleReplace: {
      type: "TINYINT(1)",
      default: "0"
    },
    announce_channel: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    announce_ping: {
      type: "TINYINT(1)",
      default: "0"
    },
    role_multipliers: {
      type: "LONGTEXT",
      default: "NULL"
    },
    channel_multipliers: {
      type: "LONGTEXT",
      default: "NULL"
    },
    category_multiplier: {
      type: "LONGTEXT",
      default: "NULL"
    },
    multiplier_replace: {
      type: "LONGTEXT",
      default: "NULL"
    },
    black_list_roles: {
      type: "LONGTEXT",
      default: "NULL"
    },
    black_list_channels: {
      type: "LONGTEXT",
      default: "NULL"
    },
    black_list_categories: {
      type: "LONGTEXT",
      default: "NULL"
    },
    xp_cooldown: {
      type: "INT(5)",
      unsigned: true,
      default: "30"
    },
    xp_settings: {
      type: "LONGTEXT",
      default: "NULL"
    },
    xp_type: {
      type: "VARCHAR(10)",
      default: "'random'"
    },
    clear_on_leave: {
      type: "TINYINT(1)",
      default: "0"
    },
    voice_enable: {
      type: "TINYINT(1)",
      default: "0"
    },
    voice_multiplier: {
      type: "INT(5)",
      unsigned: true,
      default: "100"
    },
    voice_cooldown: {
      type: "INT(5)",
      unsigned: true,
      default: "2"
    },
    deletion_date: {
      type: "TIMESTAMP",
    }
  },
  indexes: [
    {
      name: "idx_deletion_date",
      columns: ["deletion_date"]
    },
    {
      name: "idx_xp_type",
      columns: ["xp_type"]
    }
  ]
}