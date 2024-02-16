import { Request, Response, NextFunction } from 'express';
const tryCatch =
  (foo: (req: Request, res: Response) => Promise<Response<unknown, Record<string, unknown>>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await foo(req, res);
    } catch (error) {
      return next(error);
    }
  };

export default tryCatch;
