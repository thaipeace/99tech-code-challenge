import { createApp } from './app';
import { config } from './config/env';
import { closeDatabase, getDatabase } from './database/connection';

const app = createApp();

// Eagerly initialize database and schema
getDatabase();

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running in ${config.nodeEnv} mode`);
  console.log(`📡 Listening on http://localhost:${config.port}`);
  console.log(`📦 Database connected at ${config.databaseUrl}`);
  console.log(`=========================================`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  server.close(() => {
    closeDatabase();
    console.log('Database connection closed. Process terminated.');
    process.exit(0);
  });

  // Force close if graceful shutdown takes too long
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
