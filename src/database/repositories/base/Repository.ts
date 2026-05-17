import { query } from "../../query";
import { DatabaseName } from "../../types/schema";

export class Repository<DBRow, Domain = DBRow, CreateInput = Partial<DBRow>> {
  tableName: string;
  db: DatabaseName;

  constructor(tableName: string, db: DatabaseName) {
    this.tableName = tableName;
    this.db = db;
  }

  async create(data: CreateInput) {
    return query(
      this.db,
      {
        sql: `INSERT INTO ${this.tableName} SET ?`
      },
      data
    );
  }

  async bulkCreate(rows: CreateInput[]) {
    await Promise.all(
      rows.map(row =>
        query(this.db, {
          sql: `INSERT INTO ${this.tableName} SET ?`
        }, row)
      )
    );
  }

  protected mapRow(row: DBRow): Domain {
    return row as unknown as Domain;
  }

  async getAll(): Promise<Domain[]> {
    const result = await query<DBRow[]>(
      this.db, { 
        sql: 
          `SELECT * FROM ${this.tableName}` 
        }
    );

    return result.map(row => this.mapRow(row));
  }

  async getByGuildId(guildId: string): Promise<Domain | null> {
    const result = await query<DBRow[]>(
      this.db, 
      {
        sql: `SELECT * FROM ${this.tableName} WHERE guildId = ?`
      }, 
      [guildId]
    );

    const row = result[0];

    if (!row) return null;

    return this.mapRow(row);
  }
}