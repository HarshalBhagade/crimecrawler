// routes/events.js
import express from 'express';
import { handleEmailSSEConnection } from '../controllers/emailController.js';

const router = express.Router();

router.get('/email', handleEmailSSEConnection);

export default router;
