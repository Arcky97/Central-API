import { TableSchema } from "../../types/schema";

export const levelEmbedsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "levelEmbeds",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    type: {
      type: "VARCHAR(10)",
      default: "NULL"
    },
    level: {
      type: "INT(10)",
      unsigned: true,
      default: "NULL"
    },
    color: {
      type: "VARCHAR(10)",
      default: "NULL",
    },
    title: {
      type: "VARCHAR(256)",
      default: "NULL"
    },
    description: {
      type: "VARCHAR(2048)",
      default: "NULL"
    },
    imageUrl: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    thumnailUrl: {
      type: "VARCHAR(512)",
      default: "NULL"
    },
    footer: {
      type: "LONGTEXT",
      default: "NULL"
    },
    timeStamp: {
      type: "TINYINT(1)",
      default: "0"
    },
    deletionDate: {
      type: "TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_lookup",
      columns: ["guildId", "type", "level"]
    },
    {
      name: "idx_deletion_date",
      columns: ["deletionDate"]
    }
  ]
}