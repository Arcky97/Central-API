import cron from "node-cron";
import { env } from "../config/env";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { formatLocalDate } from "../utils/dateTimeStringifier";

console.log(`[YouTube] Synchronization Cron job initialized.`);

cron.schedule('0 0 * * *', async () => {
  console.log("[YouTube] Cron job started.");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - env.YOUTUBE_ANALYTICS_DELAY_DAYS);

  const service = new YoutubeSyncService();
  console.log(`[YouTube] Requesting backfill synchronization starting on ${startDate}.`);
  await service.backfillSync(formatLocalDate(startDate));
  console.log(`[YouTube] Cron job completed!`);
});