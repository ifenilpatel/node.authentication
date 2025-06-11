class ApiError extends Error {
  constructor({ status, statusCode, message, data = [], extra = {}, stack = '' }) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.extra = extra;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
