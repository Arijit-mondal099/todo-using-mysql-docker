import "dotenv/config";
import { app } from "./app.js";
import { testDatabaseConnection } from "./config/db.js";
import { initTable } from "./models/todo.model.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  await testDatabaseConnection();
  await initTable();

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

const shutdown = (signal) => {
  logger.warn(`${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
