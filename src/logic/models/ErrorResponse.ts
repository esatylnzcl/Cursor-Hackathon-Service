export class ErrorResponse<T = any> {
  status = false;
  message?: string;
  data = {};

  constructor(message?: string, data?: T) {
    if (message) this.message = message;
    if (data) this.data = data;
  }
}
