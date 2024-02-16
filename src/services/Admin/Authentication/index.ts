import { AuthorizationError } from '../../../types/classes/Errors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { SECRET_JWT_KEY, ADMIN_PASSWORD, ADMIN_LOGIN } = process.env;

if (!SECRET_JWT_KEY || !ADMIN_PASSWORD || !ADMIN_LOGIN) {
  throw new Error('check .env for secret key');
}

class AdminAuthenticationService {
  constructor() {}
  public issueToken = async (login: string, password: string) => {
    if (login !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
      throw new AuthorizationError('not valid login or password');
    }

    const payload = {
      role: 'admin',
    };

    const options = {
      expiresIn: '24h',
    };

    const token = jwt.sign(payload, SECRET_JWT_KEY!, options);

    return token;
  };
}

export default AdminAuthenticationService;
