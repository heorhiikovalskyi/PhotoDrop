import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import 'dotenv/config';
import ClientValidationService from '../../../services/Clients/Validation';
import { ValidationError } from '../../../types/classes/Errors';
import EditProfileService from '../../../services/Clients/EditProfile';

class EditProfileController extends Controller {
  constructor(private clientValidation: ClientValidationService, private editProfile: EditProfileService) {
    super('/clients');
    this.router.put('/updateName', tryCatch(this.updateName));
    this.router.put('/updateEmail', tryCatch(this.updateEmail));
  }

  private updateName = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;

    const decoded = await this.clientValidation.json(token);

    const clientId = decoded.id;

    const { name } = req.query;

    if (typeof name !== 'string') throw new ValidationError('name is not valid');

    await this.editProfile.updateName(clientId, name);

    return res.status(200).json(name);
  };

  private updateEmail = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;

    const decoded = await this.clientValidation.json(token);

    const clientId = decoded.id;

    const { email } = req.query;

    if (typeof email !== 'string') throw new ValidationError('email is not valid');

    await this.editProfile.updateEmail(clientId, email);

    return res.status(200).json(email);
  };
}

export default EditProfileController;
