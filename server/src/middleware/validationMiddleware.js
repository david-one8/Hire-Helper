import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation Error', errorMessages);
  }

  next();
};
