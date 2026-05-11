import { truncate } from "node:fs";
import { TableSchema } from "../../types/schema";

export const doggoBoardSettingsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "doggoBoardSettings",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    pinChannel: {
      type: "VARCHAR(20)",
      nullable: false 
    },
    emojiId: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    requiredReactions: {
      type: "INT(3)",
      unsigned: true,
      default: "3"
    },
    messageAgeHour: {
      type: "INT(3)",
      unsigned: true,
      default: "1"
    },
    pinAgeDay: {
      type: "INT(3)",
      unsigned: true,
      default: "1"
    },
    updateTimeMin: {
      type: "INT(3)",
      unsigned: true,
      default: "1"
    },
    reactionType: {
      type: "VARCHAR(5)",
      default: "or"
    },
    deletionDate: {
      type: "TIMESTAMP"
    }
  }
}