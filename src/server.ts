import "dotenv/config";
import { env } from "./config/env";
import app from "./app";
import { initializeDatabases } from "./database/init";
import { logError, logInfo, logSuccess } from "./database/sync/logger";

const PORT = env.PORT;

async function bootstrap() {
  try {
    logInfo("Starting ArckyTech API...");

    await initializeDatabases();

    logSuccess("Database initialization complete.");

    app.listen(PORT, () => {
      logInfo(
        `Central API is running on port ${PORT}`
      );
    });
  } catch (error) {
    logError(
      "Failed to start API:",
      error
    );

    process.exit(1);
  }
}

bootstrap();