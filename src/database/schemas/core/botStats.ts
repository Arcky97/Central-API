import { TableSchema } from "../../types/schema";

export const botStatsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "botStats",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    totalCount: {
      type: "TEXT",
      default: "NULL"
    },
    eventCount: {
      type: "TEXT",
      default: "NULL"
    },
    commandCount: {
      type: "TEXT",
      default: "NULL"
    },
    levelSystemCount: {
      type: "TEXT",
      default: "NULL"
    }
  }
}