import { Router } from "express";
import { requireScope } from "../../middleware/requireScope";
import { YouTubeController } from "../../controllers/youtube.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.use(requireScope("website", "admin"));

router.get("/channel", asyncHandler(YouTubeController.getChannelStats));

export default router;