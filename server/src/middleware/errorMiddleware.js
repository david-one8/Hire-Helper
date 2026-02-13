import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} already exists`;
    error = new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token expired');
  }

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

export const notFound = (req, res, next) => {
  const error = new ApiError(HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`);
  next(error);
};
