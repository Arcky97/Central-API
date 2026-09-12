import cron from "node-cron";
import { env } from "../config/env";
import { YoutubeSyncService } from "../services/youtube-sync.service";
import { YoutubeService } from "../services/youtube.service";
import { formatLocalDate } from "../utils/dateTimeStringifier";
import { YoutubeAccountRepository } from "../database/repositories/auth/youtubeAccountRepository";

console.log(`[YouTube] Synchronization Cron Job initialized.`);

cron.schedule('0 3 * * *', async () => {
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
      const fallbackStartDate = formatLocalDate(startDate);
      const channel = await YoutubeService.getChannel(account.channelId);

      // Reaches further back than the delay window when a prior run left a gap, instead of
      // permanently skipping any date that scrolls out of the fixed startDate..today window.
      const staleStartDate = channel ? await service.getStaleBackfillStartDate(channel) : null;
      const effectiveStartDate = staleStartDate && staleStartDate < fallbackStartDate
        ? staleStartDate
        : fallbackStartDate;

      await service.backfillSync(credentials, { startDate: effectiveStartDate });
    } catch (error) {
      console.error(`[YouTube] Scheduled sync failed for channel ${account.channelId}.`, error);
    }
  }
  console.log(`[YouTube] Cron job completed!`);
});

console.log(`[YouTube] Snapshot cleanup Cron Job initialized.`);

cron.schedule('0 3 * * *', async () => {
  console.log(`[YouTube] Cron job started.`);

  const service = new YoutubeSyncService();

  try {
    await service.pruneExpiredSnapshots();
  } catch (error) {
    console.error(`[YouTube] Snapshot cleanup failed.`, error);
  }

  console.log(`[YouTube] Cron job completed!`);
})