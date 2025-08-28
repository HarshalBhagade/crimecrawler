import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await createUser(email, hashed);
    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "email not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!user) return res.status(401).json({ message: "email not found" });
  if (!match) return res.status(401).json({ message: "Incorrect Credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};