import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getUserLogs } from "../controllers/logsController.js";

const router = express.Router();

router.get("/logs", verifyToken, getUserLogs);

export default router;