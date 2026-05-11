import { TableSchema } from "../../types/schema";

export const doggoBoardPinsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "doggoBoardPins",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    messageId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    pinMessageId: {
      type: "VARCHAR(20)",
      default: "NULL"
    },
    reactionAmount: {
      type: "SMALLINT",
      unsigned: true,
      default: "3"
    },
    deletionDate: {
      type: "TIMESTAMP",
    }
  }
}