import type { Pool, QueryOptions, QueryResult, QueryValues, RowDataPacket } from "mysql2/promise";
import { getPool } from "./pools";
import type { DatabaseName } from "./types/schema";
import { DatabaseError } from "../core/errors/DatabaseError";

export async function query<T = any>(
  database: DatabaseName,
  sql: QueryOptions,
  params?: any
): Promise<T> {
  const pool = getPool(database);
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(sql, params);
    return rows as T;
  } catch (error) {
    throw new DatabaseError("Failed to execute database query.", {
      query: sql,
      originalError: error
    });
  } finally {
    connection.release();
  }
}
