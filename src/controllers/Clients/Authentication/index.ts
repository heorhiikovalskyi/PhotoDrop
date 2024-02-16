import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import { AuthorizationError, TooManyRequests, ValidationError } from '../../../types/classes/Errors';
import ClientAuthenticationService from '../../../services/Clients/Authentication';

class ClientsAuthController extends Controller {
  constructor(private clientAuth: ClientAuthenticationService) {
    super('/clients/auth');
    this.router.post('/sendCode', tryCatch(this.sendCode));
    this.router.post('/verifyCode', tryCatch(this.verifyCode));
  }

  private sendCode = async (req: Request, res: Response) => {
    const { number } = req.body;

    if (typeof number !== 'string') throw new ValidationError('number is not valid');

    if (this.clientAuth.getClientMessagesNumber(number) === 2) throw new TooManyRequests('limit of code resend');

    await this.clientAuth.sendCode(number);

    return res.sendStatus(200);
  };

  private verifyCode = async (req: Request, res: Response) => {
    const { code, number } = req.body;

    if (typeof number !== 'string' || typeof code !== 'string')
      throw new ValidationError('number or code is not valid');

    if (!this.clientAuth.verifyCode(number, code)) throw new AuthorizationError('invalid code');

    const client = await this.clientAuth.getClient(number);

    if (!client) await this.clientAuth.insertClient(number);

    const token = await this.clientAuth.issueToken(number);

    return res.status(200).json(token);
  };
}

export default ClientsAuthController;
