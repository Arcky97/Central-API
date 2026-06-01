import { Router } from "express";
import { requireScope } from "../../middleware/requireScope";
import { asyncHandler } from "../../utils/asyncHandler";
import { LevelSettingsController } from "../../controllers/level-settings.controller";

const router = Router();

router.use(requireScope("bot", "website", "admin"));

router.get("/:guildId", asyncHandler(LevelSettingsController.getSettings));

router.post("/", asyncHandler(LevelSettingsController.updateSettings));

export default router;