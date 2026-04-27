import express from "express";
import visitsRouterV1 from "./visits/v1"
import updateRouterV1 from "./updates/v1"

const router = express.Router();

// Mount the visits router
router.use("/visits/v1", visitsRouterV1);
router.use("/updates/v1", updateRouterV1);

export default router;