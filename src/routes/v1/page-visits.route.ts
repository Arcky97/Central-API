import { Router } from "express";
import { requireScope } from "../../middleware/requireScope";
import { asyncHandler } from "../../utils/asyncHandler";
import { PageVisitsController } from "../../controllers/page-visits.controller";

const router = Router();

router.use(requireScope("website", "admin"));

router.post("/", asyncHandler(PageVisitsController.registerVisit));

router.get("/latest", asyncHandler(PageVisitsController.getLatest));

export default router;