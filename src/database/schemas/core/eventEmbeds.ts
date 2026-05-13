import { TableSchema } from "../../types/schema";

export const eventEmbedsSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "eventEmbeds",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true,
    },
    type: {
      type: "VARCHAR(15)",
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