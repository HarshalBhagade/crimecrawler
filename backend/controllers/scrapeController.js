import puppeteer from "puppeteer";
import { producer } from "../kafka/producer.js";
import { findUserById } from "../models/userModel.js";
import { createLog } from "../models/searchLogModel.js";

const SCRAPE_URL = process.env.SCRAPE_URL;

export const getUser = async (req, res) => {
  const user = await findUserById(req.userId);
  res.json({ user });
};

export const scrapeRecords = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  let browser;
  try {
    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
      await page.goto(SCRAPE_URL, { waitUntil: "networkidle2", timeout: 30000 });
    } catch (navErr) {
      if (navErr.message && navErr.message.includes("Navigation timeout")) {
        return res.status(504).json({ error: "Scrape site is not responding. Please try again later." });
      }
      throw navErr;
    }

    // Type into the search input
    await page.waitForSelector('input[placeholder*="Search"]', { timeout: 3000 });
    await page.type('input[placeholder*="Search"]', query, { delay: 100 });

    // Wait for results to filter
    await page.waitForFunction(
      (q) => {
        const rows = document.querySelectorAll("table tbody tr");
        if (!rows.length) return false;
        // If "No matching records" row is present, resolve
        if (Array.from(rows).some(row => row.textContent.includes("No matching records"))) {
          return true;
        }
        return Array.from(rows).some(row => row.querySelectorAll("td").length === 11);
      },
      { timeout: 3000 },
      query
    );

    const records = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      const results = [];

      for (const row of rows) {
        const cols = Array.from(row.querySelectorAll("td")).map((td) =>
          td.textContent.trim()
        );

        if (cols.length === 11 && !cols[0].includes("No matching")) {
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

      return results;
    });

    if (records.length > 0) {
      await producer.send({
        topic: "scraped-records",
        messages: [
          {
            value: JSON.stringify({
              email: user.email,
              query,
              results: records,
              userId: user.id,
            }),
          },
        ],
      });
      await createLog(user.id, query, records);
    }

    res.json({ records });
  } catch (err) {
    console.error("Scraping error:", err.message);
    if (err.name === "TimeoutError") {
      res.status(504).json({ error: "Scrape operation timed out. Please try again." });
    } else {
      res.status(500).json({ error: "Failed to scrape data" });
    }
  } finally {
    if (browser) await browser.close();
  }
};
