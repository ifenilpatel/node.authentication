class ApiResponse {
  constructor({ statusCode, message, data = [], extra = {} }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.extra = extra;
  }
}

export default ApiResponse;
