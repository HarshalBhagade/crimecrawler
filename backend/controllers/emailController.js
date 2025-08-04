import jwt from 'jsonwebtoken';
import { addSSEClient, removeSSEClient } from '../utils/sse.js';

export const handleEmailSSEConnection = (req, res) => {
  const token = req.query.token;
  if (!token) {
    console.log('No token provided');
    return res.status(401).end();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
    });

    // Send initial connection message
    res.write('data: connected\n\n');

    // Add client to our tracking system
    addSSEClient(userId, res);

    // Heartbeat every 25 seconds
    const heartbeatInterval = setInterval(() => {
      res.write(':heartbeat\n\n');
    }, 25000);

    // Clean up on connection close
    req.on('close', () => {
      clearInterval(heartbeatInterval);
      removeSSEClient(userId);
    });

  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).end();
  }
};
