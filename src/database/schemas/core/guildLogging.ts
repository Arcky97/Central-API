import type { TableSchema } from "../../types/schema";

export const guildLoggingSchema: TableSchema = {
  version: 1,
  strict: true, 
  database: "core",
  table: "guildLogging",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    config: {
      type: "TEXT",
      nullable: false
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