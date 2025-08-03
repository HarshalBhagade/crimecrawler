import { findLogsByUserId } from "../models/searchLogModel.js";

export const getUserLogs = async (req, res) => {
  try {
    const userId = req.userId; 
    const logs = await findLogsByUserId(userId);
    res.json({ logs });
  } catch (error) {
    console.error("Logs error:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};