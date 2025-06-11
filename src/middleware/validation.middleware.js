import { validationResult } from 'express-validator';

import { HTTP_STATUS, STATUS_CODE } from '../../constants/constant.js';

import ApiError from '../../utils/ApiError.js';

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      path: error.path,
      message: error.msg,
    }));

    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      statusCode: STATUS_CODE.VALIDATION_ERROR,
      message: 'Validation failed. Please check your input.',
      data: formattedErrors,
    });
  }
  next();
};

export default validationHandler;
