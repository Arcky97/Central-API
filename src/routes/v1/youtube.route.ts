import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { YoutubeController } from "../../controllers/youtube.controller";
import { requireScope } from "../../middleware/requireScope";

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

router.post(
  "/sync",
  requireScope("admin"),
  asyncHandler(YoutubeController.sync)
);

export default router;