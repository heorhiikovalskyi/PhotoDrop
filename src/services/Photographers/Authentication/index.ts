import { PhotographersRepository } from '../../../repositories/Photographers';
import { ValidationError, AuthorizationError } from '../../../types/classes/Errors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { SECRET_JWT_KEY } = process.env;

if (!SECRET_JWT_KEY) {
  throw new Error('check .env for secret key');
}

class PhotographersAuthenticationService {
  constructor(private photographers: PhotographersRepository) {}
  public issueToken = async (login: string, password: string) => {
    const photographer = (await this.photographers.getByLogin(login))[0];

    if (!photographer) {
      throw new AuthorizationError('not valid login');
    }

    if (photographer.password !== password) {
      throw new AuthorizationError('not valid password');
    }

    const { id: photographerId } = photographer;

    const payload = {
      id: photographerId,
      role: 'photograph',
    };

    const options = {
      expiresIn: '24h',
    };

    const token = jwt.sign(payload, SECRET_JWT_KEY!, options);

    return token;
  };
}

export default PhotographersAuthenticationService;
