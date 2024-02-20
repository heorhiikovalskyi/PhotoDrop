import { Request, Response, NextFunction } from 'express';

export type MiddlewareFunction = (req: Request, res: Response) => Promise<Response<unknown, Record<string, unknown>>>;
export type TokenHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const tryCatch =
  (foo: MiddlewareFunction | TokenHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await foo(req, res, next);
    } catch (error) {
      return next(error);
    }
  };

export default tryCatch;
