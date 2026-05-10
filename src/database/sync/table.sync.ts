import type { RowDataPacket } from "mysql2";

import { query } from "../query";
import type { TableSchema } from "../types/schema";

import { buildCreateTableSQL } from "../utils/buildCreateTableSQL";

import {
  logInfo,
  logSuccess 
} from "./logger";

interface TableExistsRow extends RowDataPacket {
  count: number;
}

export async function syncTable(
  schema: TableSchema
) {
  logInfo(`Checking table ${schema.table}...`);

  const rows = await query<TableExistsRow[]>(
    schema.database,
    `
    SELECT COUNT(*) as count
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = ?
    `,
    [schema.table]
  );

  const exists = (rows[0]?.count ?? 0) > 0;

  if (!exists) {
    const sql = buildCreateTableSQL(schema);

    await query(schema.database, sql);

    logSuccess(
      `Created table ${schema.table}`
    );
  } else {
    logSuccess(
      `Table ${schema.table} exists`
    );
  }
}