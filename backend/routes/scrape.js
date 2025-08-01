import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getUser, scrapeRecords } from "../controllers/scrapeController.js";

const router = express.Router();

router.get("/", verifyToken, getUser);
router.post("/scrape", verifyToken, scrapeRecords);

export default router;