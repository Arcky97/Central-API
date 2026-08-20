import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { authenticateJWT } from "../../middleware/jwt";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireScope } from "../../middleware/requireScope";

const router = Router();

router.use(requireScope("website", "admin"));

// YouTube OAuth flow
router.get("/youtube/login", asyncHandler(AuthController.youtubeLogin));
router.get("/youtube/callback", asyncHandler(AuthController.youtubeCallback));
router.post("/logout", asyncHandler(AuthController.logout));

// Discord OAuth flow
//router.get("/discord/login", asyncHandler(AuthController.discordLogin));
//router.get("/discord/callback", asyncHandler(AuthController.discordCallback));

// User profile (requires authentication)
router.get("/me", authenticateJWT, asyncHandler(AuthController.getProfile));

export default router;