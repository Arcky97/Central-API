import { query } from "../../query";
import { DatabaseName } from "../../types/schema";

export class Repository {
  tableName: string;
  db: DatabaseName;

  constructor(tableName: string, db: DatabaseName) {
    this.tableName = tableName;
    this.db = db;
  }

  async getAll() {
    return query(
      this.db, { 
        sql: 
          `SELECT * FROM ${this.tableName}` 
        }
    );
  }

  async getByGuildId(guildId: string) {
    return query(
      this.db, {
        sql:
          `SELECT * FROM ${this.tableName} WHERE guildId = ?`
      }, [guildId]
    )
  }
}