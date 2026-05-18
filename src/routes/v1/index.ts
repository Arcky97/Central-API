import { Router } from "express";
import guildSettingsV1 from "./guild-settings.route";
import pageVisitsV1 from "./page-visits.route";
import projectUpdatesV1 from "./project-updates.route";
const router = Router();

router.use("/guild-settings", guildSettingsV1);
router.use("/page-visits", pageVisitsV1);
router.use("/project-updates", projectUpdatesV1);

export default router;