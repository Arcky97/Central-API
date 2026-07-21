import { Router } from "express";
import { requireScope } from "../../middleware/requireScope";
import { asyncHandler } from "../../utils/asyncHandler";
import { BotRepliesController } from "../../controllers/bot-replies.controller";

const router = Router();

router.use(requireScope("bot", "website", "admin"));

router.get("/:uuid", asyncHandler(BotRepliesController.getReply));

router.get("/", asyncHandler(BotRepliesController.listReplies))

export default router;