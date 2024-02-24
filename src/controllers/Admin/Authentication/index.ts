import Controller from '../../Controller';
import AdminAuthenticationService from '../../../services/Admin/Authentication';
import { ValidationError } from '../../../types/classes/Errors';
import { Request, Response } from 'express';
import tryCatch from '../../../tryCatch';
import { UserSchema } from './validation';

class AdminAuthenticationController extends Controller {
  constructor(private adminAuth: AdminAuthenticationService) {
    super('/admin');
    this.router.post('/auth', tryCatch(this.login));
  }

  private login = async (req: Request, res: Response) => {
    const { login, password } = req.body;

    UserSchema.parse({ login, password });

    const token = await this.adminAuth.issueToken(login, password);

    return res.status(200).json(token);
  };
}

export default AdminAuthenticationController;
