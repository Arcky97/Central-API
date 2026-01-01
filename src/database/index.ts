import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { getDatabasePool } from "./pool";

/**
 * Execute a SQL query using the shared pool
 */
export async function query<T = RowDataPacket[]>(
  sql: string,
  params: unknown[] = []
): Promise<T> {
  const pool = getDatabasePool();
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.execute(sql, params);
    return result as T;
  } finally {
    connection.release();
  }
}