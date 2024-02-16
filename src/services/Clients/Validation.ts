import { ValidationError, AuthorizationError } from '../../types/classes/Errors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const { SECRET_JWT_KEY } = process.env;

class ClientValidationService {
  constructor() {}

  public json = async (token: unknown) => {
    if (typeof token !== 'string' || !token.startsWith('Bearer ')) throw new AuthorizationError('token is not valid');

    token = token.split(' ')[1];

    const decoded = jwt.verify(token as string, SECRET_JWT_KEY!);

    if (typeof decoded === 'string' || decoded.role !== 'client') throw new AuthorizationError('token is not valid');

    return { id: decoded.id, role: decoded.role } as { id: number; role: 'client' };
  };
}

export default ClientValidationService;
