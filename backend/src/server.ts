import { createServer } from 'http';
import app from './app';
import { initSocket } from './socket/socket';

const PORT = process.env.PORT || 8000;

// Create HTTP Server wrapping Express App
const httpServer = createServer(app);

// Initialize WebSocket Singleton Server
initSocket(httpServer);

const server = httpServer.listen(PORT, () => {
  console.log(`🚀 SafeRoad Backend Server running on port ${PORT}`);
});

// Handle unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (err: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  if (err instanceof Error) {
    console.error(err.name, err.message, err.stack);
  } else {
    console.error(err);
  }
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err: any) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  if (err instanceof Error) {
    console.error(err.name, err.message, err.stack);
  } else {
    console.error(err);
  }
  process.exit(1);
});
