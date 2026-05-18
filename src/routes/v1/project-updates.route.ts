import { Router } from "express";
import { requireScope } from "../../middleware/requireScope";
import { asyncHandler } from "../../utils/asyncHandler";
import { ProjectUpdatesController } from "../../controllers/project-updates.controller";

const router = Router();

router.use(requireScope("website", "admin"));

router.post("/bulk", asyncHandler(ProjectUpdatesController.registerBulkUpdates));

export default router;