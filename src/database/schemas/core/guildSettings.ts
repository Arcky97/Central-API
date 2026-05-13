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
    logging: {
      type: "TINYINT(1)",
      default: "0"
    },
    leveling: {
      type: "TINYINT(1)",
      default: "1"
    },
    doggoBoard: {
      type: "TINYINT(1)",
      default: "0"
    },
    reactionRoles: {
      type: "TINYINT(1)",
      default: "0"
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