import { TableSchema } from "../../types/schema";

export const userStatsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "userStats",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    memberId :{
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    attemps: {
      type: "LONGTEXT",
      default: "NULL"
    },
    commands: {
      type: "LONGTEXT",
      default: "NULL"
    }
  }
}