import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());

const prisma = new PrismaClient();

app.get('/api/records', async (req, res) => {
  try {
    const records = await prisma.criminal_records.findMany();
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
