import { Request, Response, NextFunction } from 'express';
import ClientValidationService from '../../services/Clients/Validation';
import { AuthorizationError } from '../../types/classes/Errors';
const { SECRET_JWT_KEY } = process.env;
import jwt from 'jsonwebtoken';
export const clientTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  let { authorization: token } = req.headers;

  if (typeof token !== 'string' || !token.startsWith('Bearer ')) throw new AuthorizationError('token is not valid');

  token = token.split(' ')[1];

  const decoded = jwt.verify(token as string, SECRET_JWT_KEY!);

  if (typeof decoded === 'string' || decoded.role !== 'client') throw new AuthorizationError('token is not valid');

  res.locals.user = { clientId: decoded.id, role: decoded.role } as { clientId: number; role: 'client' };

  next();
};
