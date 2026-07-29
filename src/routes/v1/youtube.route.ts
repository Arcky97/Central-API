import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { YoutubeController } from "../../controllers/youtube.controller";
import { requireScope } from "../../middleware/requireScope";
import { YoutubeOAuthController } from "../../controllers/youtube-oauth.controller";
import { env } from "../../config/env";

const router = Router();

router.get(
  "/channel", 
  asyncHandler(YoutubeController.getChannel)
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
  "/videos/:videoId/snapshots", 
  asyncHandler(YoutubeController.getSnapshots)
);

router.patch(
  "/video/:videoId",
  asyncHandler(YoutubeController.updateVideo)
)

router.get(
  "/profile/:profileId",
  asyncHandler(YoutubeController.getGoalProfile)
);

router.post(
  "/profile",
  asyncHandler(YoutubeController.createGoalProfile)
)

router.patch(
  "/profile/:profileId",
  asyncHandler(YoutubeController.updateGoalProfile)
);

router.delete(
  "profile/:profileId",
  asyncHandler(YoutubeController.removeGoalProfile)
);

router.post(
  "/sync",
  requireScope("admin"),
  asyncHandler(YoutubeController.sync)
);

router.post(
  "/sync/fill/:date",
  asyncHandler(YoutubeController.backfillSync)
);

// dev only

if (env.NODE_ENV === "development") {
  router.get(
    "/oauth/url",
    asyncHandler(YoutubeOAuthController.getAuthUrl)
  );

  router.get(
    "/oauth/callback",
    asyncHandler(YoutubeOAuthController.callback)
  );

  router.get(
    "/analytics/test",
    asyncHandler(YoutubeController.testAnalytics)
  );
}



export default router;