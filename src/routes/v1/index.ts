import { Router } from "express";
import authV1 from "./auth.route";
import guildSettingsV1 from "./guild-settings.route";
import pageVisitsV1 from "./page-visits.route";
import projectUpdatesV1 from "./project-updates.route";
import youtubeV1 from "./youtube.route";
const router = Router();

router.use("/auth", authV1);
router.use("/guild-settings", guildSettingsV1);
router.use("/page-visits", pageVisitsV1);
router.use("/project-updates", projectUpdatesV1);
router.use("/youtube", youtubeV1)

export default router;