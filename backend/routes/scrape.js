import express from "express";
import { PrismaClient } from "@prisma/client";
import { producer } from "../kafka/producer.js";
import verifyToken from "../middleware/verifyToken.js";
import puppeteer from "puppeteer";

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
    if (!user) return res.status(404).json({ error: "User not found" });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Enable console log passthrough from browser
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    await page.goto(SCRAPE_URL, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait until table rows have loaded
    await page.waitForFunction(() => {
      const rows = document.querySelectorAll("table tbody tr");
      return rows.length > 0;
    }, { timeout: 30000 });

    const records = await page.evaluate((searchName) => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      const results = [];

      rows.forEach((row) => {
        const cols = Array.from(row.querySelectorAll("td")).map((td) =>
          td.textContent.trim()
        );

        if (
          cols.length === 11 &&
          cols[0].toLowerCase().includes(searchName.toLowerCase())
        ) {
          results.push({
            name: cols[0],
            dob: cols[1],
            gender: cols[2],
            national_id: cols[3],
            location: cols[4],
            offense: cols[5],
            offense_date: cols[6],
            status: cols[7],
            officer: cols[8],
            case_id: cols[9],
            sentence: cols[10],
          });
        }
      });

      return results;
    }, name);

    await browser.close();

    // Send to Kafka
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
    console.error(err.stack);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

export default router;