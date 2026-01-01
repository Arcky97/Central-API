import express from "express";
import visitsRouter from "./v1/pageVisits"

const router = express.Router();

// Mount the visits router
router.use("/visits", visitsRouter);

export default router;