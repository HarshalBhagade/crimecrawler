import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import scrapeRoutes from "./routes/scrape.js";
import dotenv from "dotenv";
import { startConsumer } from "./kafka/consumer.js";
import logs from "./routes/logs.js";
import email from "./routes/email.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
const PORT = 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", scrapeRoutes);
app.use("/api", logs);
app.use("/api", email)
 

app.listen(PORT, () => {
 console.log("Server running on port 3000")
 startConsumer(); 
});
