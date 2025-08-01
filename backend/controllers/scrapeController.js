import puppeteer from "puppeteer";
import { producer } from "../kafka/producer.js";
import { findUserById } from "../models/userModel.js";

const SCRAPE_URL = process.env.SCRAPE_URL;

export const getUser = async (req, res) => {
  const user = await findUserById(req.userId);
  res.json({ user });
};

export const scrapeRecords = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(SCRAPE_URL, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForFunction(() => {
      const rows = document.querySelectorAll("table tbody tr");
      return rows.length > 0;
    }, { timeout: 30000 });

    const records = await page.evaluate((searchQuery) => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      const results = [];
      rows.forEach((row) => {
        const cols = Array.from(row.querySelectorAll("td")).map((td) =>
          td.textContent.trim()
        );
        if (cols.length === 11) {
          const [name, , , national_id, , , , , , case_id] = cols;
          const lowerQuery = searchQuery.toLowerCase();
          const matches =
            name.toLowerCase().includes(lowerQuery) ||
            national_id.toLowerCase().includes(lowerQuery) ||
            case_id.toLowerCase().includes(lowerQuery);
          if (matches) {
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
        }
      });
      return results;
    }, query);

    await browser.close();

    if (records.length > 0) {
      await producer.send({
        topic: "scraped-records",
        messages: [
          {
            value: JSON.stringify({
              email: user.email,
              query,
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
};