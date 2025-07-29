import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {load} from "cheerio";
import axios from "axios";
import { Kafka } from "kafkajs";
import { startConsumer } from "./kafka/consumer.js";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;
const SCRAPE_URL = "http://localhost:60845/"; 

const JWT_SECRET = process.env.JWT_SECRET;

// Kafka setup
const kafka = new Kafka({
  clientId: 'crimecrawler',
  brokers: [process.env.KAFKA_BROKER]
});
const producer = kafka.producer();
await producer.connect();

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { email, password: hashed } });
    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
    console.log(e);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "email not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "wrong password" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Protected route
app.get("/", verifyToken, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ user });
});

// Middleware
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Scrape route
app.post("/scrape", verifyToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const { data } = await axios.get(SCRAPE_URL);
    const $ = load(data);
    const records = [];

    $("table tbody tr").each((_, row) => {
      const cols = $(row).find("td").map((index, element) => $(element).text()).get();

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

    res.json({ records });
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.listen(PORT, () => {
 console.log("Server running on port 3000")
 startConsumer(); 
});
