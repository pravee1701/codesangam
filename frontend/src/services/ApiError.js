export class ApiErrorResponse {
    constructor(statusCode, message, errors, stack) {
      this.statusCode = statusCode;
      this.message = message;
      this.errors = errors;
      this.stack = stack;
    }
  }
  
  class ApiError {
    constructor(errorMessage, errorData, errorResponse) {
      this.error = true;
      this.errorMessage = errorMessage;
      this.errorData = errorData;
      this.errorResponse = errorResponse;
    }
  }
  
  export default ApiError;
  