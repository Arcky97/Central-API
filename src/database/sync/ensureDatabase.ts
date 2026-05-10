import { RowDataPacket } from "mysql2";
import { databaseNames } from "../pools";
import { getRootConnection } from "../root";

import { logInfo, logSuccess, logWarning } from "./logger";

export async function ensureDatabases() {
  const connection = await getRootConnection();

  try {
    for (const databaseName of Object.values(databaseNames)) {
      logInfo(`Checking database ${databaseName}...`);
      
      const [rows] = await connection.query<RowDataPacket[]>(
        `
        SELECT SCHEMA_NAME
        FROM INFORMATION_SCHEMA.SCHEMATA
        WHERE SCHEMA_NAME = ?
        `,
        [databaseName]
      );

      const exists = rows.length > 0;

      if (!exists) {
        logWarning(`Database ${databaseName} does not exist`);

        logInfo(`Creating database ${databaseName}...`);

        await connection.query(
          `
          CREATE DATABASE \`${databaseName}\`
          CHARACTER SET utf8mb4
          COLLATE utf8mb4_unicode_ci
          `
        );

        logSuccess(`Created database ${databaseName}`);
      } else {
        logSuccess(`Database ${databaseName} exists`);
      }
    }
  } finally {
    await connection.end();
  }
}