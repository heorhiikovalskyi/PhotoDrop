import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import { ValidationError } from '../../../types/classes/Errors';
import PhotographersAuthenticationService from '../../../services/Photographers/Authentication';

class PhotographersAuthenticationController extends Controller {
  constructor(private photographersAuth: PhotographersAuthenticationService) {
    super('/photographers');
    this.router.post('/auth', tryCatch(this.login));
  }

  private login = async (req: Request, res: Response) => {
    const { login, password } = req.body;

    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new ValidationError('login and password should be strings');
    }

    const token = await this.photographersAuth.issueToken(login, password);

    return res.status(200).json(token);
  };
}

export default PhotographersAuthenticationController;
