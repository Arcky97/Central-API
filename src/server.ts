import "dotenv/config";
import { env } from "./config/env";
import app from "./app";
import { initializeDatabases } from "./database/init";

const PORT = env.PORT;

async function bootstrap() {
  try {
    console.log("Starting ArckyTech API...");

    await initializeDatabases();

    console.log("Database initialization complete.");

    app.listen(PORT, () => {
      console.log(
        `Central API is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start API:",
      error
    );

    process.exit(1);
  }
}

bootstrap();