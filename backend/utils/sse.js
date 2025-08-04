const sseClients = new Map();

export const addSSEClient = (userId, res) => {
  try {
    // Check if connection is still writable
    if (res.writableEnded) {
      console.log('Connection already closed');
      return;
    }

    sseClients.set(userId, res);
  } catch (err) {
    console.error('Error adding SSE client:', err);
  }
};

export const notifyClient = (userId, data) => {
  try {
    const client = sseClients.get(userId);
    if (client && !client.writableEnded) {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } else {
      console.log(`No active SSE client for user ${userId}`);
      removeSSEClient(userId);
    }
  } catch (err) {
    console.error('Error notifying client:', err);
  }
};

export const removeSSEClient = (userId) => {
  sseClients.delete(userId);
};