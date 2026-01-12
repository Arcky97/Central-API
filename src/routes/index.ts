import express from "express";
import visitsRouterV1 from "./visits/v1"

const router = express.Router();

// Mount the visits router
router.use("/visits/v1", visitsRouterV1);

export default router;