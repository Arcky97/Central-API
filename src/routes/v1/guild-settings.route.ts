import { Router } from "express";
import { requireScope } from "../../middleware/requireScope";
import { asyncHandler } from "../../utils/asyncHandler";
import { GuildSettingsController } from "../../controllers/guild-settings.controller";

const router = Router();

router.use(requireScope("bot", "website", "admin"));

router.get(
  "/:guildId", 
  asyncHandler(GuildSettingsController.getSettings)
);

export default router;