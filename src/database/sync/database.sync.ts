import { schemas } from "../schemas";

import { syncTable } from "./table.sync";
import { syncColumns } from "./columns.sync";
import { syncIndexes } from "./indexes.sync";

import { logSection, logSuccess } from "./logger";

export async function syncDatabase() {
  logSection(
    "ArckyTech Database Synchronizer"
  );

  for (const schema of schemas) {
    await syncTable(schema);

    await syncColumns(schema);

    await syncIndexes(schema);
  }

  logSuccess(
    "Database synchronization complete"
  );
}