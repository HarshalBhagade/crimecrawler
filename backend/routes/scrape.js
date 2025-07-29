import express from "express";
import axios from "axios";
import { load } from "cheerio";
import { PrismaClient } from "@prisma/client";
import { producer } from "../kafka/producer.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
const prisma = new PrismaClient();
const SCRAPE_URL = process.env.SCRAPE_URL;

// Routes
router.get("/", verifyToken, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ user });
});

router.post("/scrape", verifyToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const { data } = await axios.get(SCRAPE_URL);
    const $ = load(data);
    const records = [];

    $("table tbody tr").each((_, row) => {
      const cols = $(row)
        .find("td")
        .map((i, el) => $(el).text())
        .get();
      if (cols[0].toLowerCase().includes(name.toLowerCase())) {
        records.push({
          name: cols[0],
          dob: cols[1],
          location: cols[2],
          offense: cols[3],
          date: cols[4],
          status: cols[5],
        });
      }
    });

    if (records.length > 0) {
      await producer.send({
        topic: "scraped-records",
        messages: [
          {
            value: JSON.stringify({
              email: user.email,
              query: name,
              results: records,
            }),
          },
        ],
      });
    }

    res.json({ records });
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

export default router;
