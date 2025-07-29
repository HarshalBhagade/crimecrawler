import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import scrapeRoutes from "./routes/scrape.js";
import dotenv from "dotenv";
import { startConsumer } from "./kafka/consumer.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", scrapeRoutes);


app.listen(PORT, () => {
 console.log("Server running on port 3000")
 startConsumer(); 
});
