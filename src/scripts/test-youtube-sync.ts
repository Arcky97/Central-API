import { YoutubeSyncService } from "../services/youtube-sync.service";

async function main() {
  try {
    console.log("Starting YouTube sync...");

    const service = new YoutubeSyncService();

    await service.sync();

    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();