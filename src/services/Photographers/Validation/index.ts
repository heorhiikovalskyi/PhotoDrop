import { AuthorizationError } from '../../../types/classes/Errors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const { SECRET_JWT_KEY } = process.env;

class PhotographerValidationService {
  constructor() {}

  public json = async (token: unknown) => {
    if (typeof token !== 'string' || !token.startsWith('Bearer ')) throw new AuthorizationError('not valid token');

    token = token.split(' ')[1];

    const decoded = jwt.verify(token as string, SECRET_JWT_KEY!);

    if (typeof decoded === 'string' || decoded.role !== 'photograph') throw new AuthorizationError('not valid token');
    return { id: decoded.id, role: decoded.role } as { id: number; role: 'photographer' };
  };
}

export default PhotographerValidationService;
