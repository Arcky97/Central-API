import cron from "node-cron";
import { env } from "../config/env";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { formatLocalDate } from "../utils/dateTimeStringifier";
import { YoutubeAccountRepository } from "../database/repositories/auth/youtubeAccountRepository";

console.log(`[YouTube] Synchronization Cron job initialized.`);

cron.schedule('0 0 * * *', async () => {
  console.log("[YouTube] Cron job started.");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - env.YOUTUBE_ANALYTICS_DELAY_DAYS);

  const service = new YoutubeSyncService();
  const accountRepo = new YoutubeAccountRepository();
  const accounts = await accountRepo.getAll();
  console.log(`[YouTube] Requesting backfill synchronization for ${accounts.length} account(s) starting on ${startDate}.`);

  for (const account of accounts) {
    const credentials = await accountRepo.getCredentialsByAuthUserId(account.authUserId);
    if (!credentials) continue;

    try {
      await service.backfillSync(credentials, formatLocalDate(startDate));
    } catch (error) {
      console.error(`[YouTube] Scheduled sync failed for channel ${account.channelId}.`, error);
    }
  }
  console.log(`[YouTube] Cron job completed!`);
});