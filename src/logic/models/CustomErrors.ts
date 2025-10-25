export class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed. Please log in.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "You are not authorized!") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class DuplicationError extends Error {
  constructor(public data: object, message: string = "Duplication on " + data) {
    super(message);
    this.name = "DuplicationError";
    this.data = data;
  }
}

export class SessionError extends Error {
  constructor(message: string = "Session error") {
    super(message);
    this.name = "SessionError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not found error") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class CredentialsError extends Error {
  constructor(message: string = "Invalid credentials") {
    super(message);
    this.name = "CredentialsError";
  }
}

export class InvalidParameter extends Error {
  constructor(param: string, message: string = "İnvalid Parameters" + param) {
    super(message);
    this.name = "InvalidParametersError";
  }
}

export class InvalidOperationError extends Error {
  constructor(message: string = "Invalid Operation") {
    super(message);
    this.name = "InvalidOperationError";
  }
}
