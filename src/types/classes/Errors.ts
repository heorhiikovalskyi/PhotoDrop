export class ValidationError extends Error {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 400;
  }
}

export class ServerError extends Error {
  public code: number;

  constructor(message: string = 'Server is not able to response') {
    super(message);
    this.code = 500;
  }
}

export class AuthorizationError extends Error {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 401;
  }
}

export class TooManyRequests extends Error {
  public code: number;

  constructor(message: string) {
    super(message);
    this.code = 429;
  }
}
