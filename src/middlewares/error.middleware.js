import { logger } from "../utils/logger.js"

// 404 handler
export const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ status: 'error', message: 'Duplicate entry' });
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({ status: 'error', message });
};
