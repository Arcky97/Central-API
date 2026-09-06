import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { YoutubeController } from "../../controllers/youtube.controller";
import { YoutubeSyncController } from "../../controllers/youtube-sync.controller";
import { requireScope } from "../../middleware/requireScope";
import { YoutubeOAuthController } from "../../controllers/youtube-oauth.controller";
import { AuthController } from "../../controllers/auth.controller";
import { env } from "../../config/env";
import { authenticateJWT } from "../../middleware/jwt";

const router = Router();

router.use(requireScope("website", "admin"));
router.use("/sync", authenticateJWT);
router.use("/channel", authenticateJWT);
router.use("/videos", authenticateJWT);
router.use("/video", authenticateJWT);
router.use("/profile", authenticateJWT);
router.use("/profiles", authenticateJWT);

// Sync endpoints (job-based)
router.post(
  "/sync",
  asyncHandler(YoutubeSyncController.startSync)
);

/*
// Old backfill, not used but kept for reference.
router.post(
  "/sync/fill/:date",
  asyncHandler(YoutubeSyncController.startBackfill)
);
*/

router.get(
  "/sync/fill/:videoId{/:date}",
  asyncHandler(YoutubeSyncController.syncVideoByDate)
)

router.get(
  "/sync/jobs/:jobId",
  asyncHandler(YoutubeSyncController.getJobStatus)
);

// Data endpoints
router.get(
  "/channel", 
  asyncHandler(YoutubeController.getChannel)
);

router.get(
  "/channel/snapshots",
  asyncHandler(YoutubeController.getChannelSnapshots)
);

router.get(
  "/videos", 
  asyncHandler(YoutubeController.getVideos)
);

router.get(
  "/videos/:videoId", 
  asyncHandler(YoutubeController.getVideo)
);

router.get(
  "/videos/days/:days",
  asyncHandler(YoutubeController.getVideosByLastDays)
)

router.get(
  "/videos/:videoId/snapshots", 
  asyncHandler(YoutubeController.getVideoSnapshots)
);

router.patch(
  "/video/:videoId",
  asyncHandler(YoutubeController.updateVideo)
)

router.get(
  "/profiles", 
  asyncHandler(YoutubeController.getAllProfilesByChannelId)
);

router.get(
  "/profile/:goalProfileId",
  asyncHandler(YoutubeController.getGoalProfile)
);

router.post(
  "/profile",
  asyncHandler(YoutubeController.createGoalProfile)
)

router.patch(
  "/profile/:goalProfileId",
  asyncHandler(YoutubeController.updateGoalProfile)
);

router.delete(
  "/profile/:goalProfileId",
  asyncHandler(YoutubeController.removeGoalProfile)
);

// dev only

if (env.NODE_ENV === "development") {
  router.get(
    "/oauth/url",
    asyncHandler(YoutubeOAuthController.getAuthUrl)
  );

}

router.get(
  "/oauth/callback",
  asyncHandler(AuthController.youtubeCallback)
);

export default router;