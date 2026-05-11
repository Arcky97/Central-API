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
      type: "LONGTEXT",
      default: "NULL"
    },
    eventCount: {
      type: "LONGTEXT",
      default: "NULL"
    },
    commandCount: {
      type: "LONGTEXT",
      default: "NULL"
    },
    levelSystemCount: {
      type: "LONGTEXT",
      default: "NULL"
    }
  }
}