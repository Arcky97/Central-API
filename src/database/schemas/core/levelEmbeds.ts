import { TableSchema } from "../../types/schema";

export const levelEmbedsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "levelEmbeds",
  columns: {
    id: {
      type: "INT",
      unsigned: true,
      autoIncrement: true,
      primaryKey: true
    },
    guildId: {
      type: "VARCHAR(20)",
      nullable: false
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
    config: {
      type: "LONGTEXT",
      nullable: false
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
      name: "idx_guild",
      columns: ["guildId"]
    },
    {
      name: "idx_deletion_date",
      columns: ["deletionDate"]
    }
  ]
}