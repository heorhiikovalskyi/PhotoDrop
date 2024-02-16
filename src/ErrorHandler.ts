import { Request, Response, NextFunction } from 'express';
import { isDbError } from './types/interfaces/Error';
import { ValidationError, AuthorizationError, TooManyRequests } from './types/classes/Errors';
import { JsonWebTokenError } from 'jsonwebtoken';

class ErrorHandler {
  sql = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (isDbError(err)) {
      const { code } = err;
      switch (code) {
        case '23505':
          return res.status(400).send('data should be unique');
        default:
          console.log(err);
          return res.sendStatus(500);
      }
    }
    next(err);
  };

  validation = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
      const { code, message } = err;
      return res.status(code).send(message);
    }
    next(err);
  };

  json = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof JsonWebTokenError || err instanceof AuthorizationError) {
      const { message } = err;
      return res.status(401).send(message);
    }
    next(err);
  };

  limitRequests = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof TooManyRequests) {
      const { message, code } = err;
      return res.status(code).send(message);
    }
    next(err);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res.sendStatus(500);
  };
}

export default ErrorHandler;
