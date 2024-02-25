import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import 'dotenv/config';
import ClientValidationService from '../../../services/Clients/Validation';
import { ValidationError } from '../../../types/classes/Errors';
import EditProfileService from '../../../services/Clients/EditProfile';
import { clientTokenHandler } from '../tokenHandler';
import { z } from 'zod';

class EditProfileController extends Controller {
  constructor(private clientValidation: ClientValidationService, private editProfile: EditProfileService) {
    super('/clients');
    this.router.put('/updateName', tryCatch(clientTokenHandler), tryCatch(this.updateName));
    this.router.put('/updateEmail', tryCatch(clientTokenHandler), tryCatch(this.updateEmail));
  }

  private updateName = async (req: Request, res: Response) => {
    const { clientId } = res.locals.user;

    const { name: name_ } = req.query;

    const name = z.string().parse(name_);

    await this.editProfile.updateName(clientId, name);

    return res.status(200).json(name);
  };

  private updateEmail = async (req: Request, res: Response) => {
    const { clientId } = res.locals.user;

    const { email: email_ } = req.query;

    const email = z.string().parse(email_);

    await this.editProfile.updateEmail(clientId, email);

    return res.status(200).json(email);
  };
}

export default EditProfileController;
