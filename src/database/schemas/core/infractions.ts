import { TableSchema } from "../../types/schema";

export const infractionsSchema: TableSchema = {
  version: 1,
  strict: true, 
  database: "core",
  table: "infractions",
  columns: {
    id: {
      type: "BIGINT",
      autoIncrement: true,
      primaryKey: true
    },
    guildId: {
      type: "VARCHAR(20)",
      nullable: false
    },
    userId: {
      type: "VARCHAR(20)",
      nullable: false 
    },
    modId: {
      type: "VARCHAR(20)",
      nullable: false 
    },
    timeoutId: {
      type: "VARCHAR(100)",
      default: "NULL"
    },
    action: {
      type: "VARCHAR(100)",
      nullable: false 
    },
    reason: {
      type: "VARCHAR(1024)",
      default: "NULL"
    },
    status: {
      type: "VARCHAR(16)",
      default: "completed"
    },
    formatDuration: {
      type: "VARCHAR(100)",
      default: "NULL"
    },
    date: {
      type: "TIMESTAMP",
      nullable: false,
      default: "CURRENT_TIMESTAMP"
    },
    endTime: {
      type: "TIMESTAMP"
    },
    deletionDate: {
      type: "TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_status",
      columns: ["status"]
    },
    {
      name: "idx_end_time",
      columns: ["endTime"]
    },
    {
      name: "idx_guild_user",
      columns: ["guildId", "userId"]
    },
    {
      name: "idx_guild_date",
      columns: ["guildId", "date"]
    },
    {
      name: "idex_deletion_date",
      columns: ["deletionDate"]
    }
  ]
}