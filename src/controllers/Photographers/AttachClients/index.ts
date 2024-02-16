import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import AttachClientsService from '../../../services/Photographers/AttachClients';
import { Request, Response } from 'express';
import PhotographerValidationService from '../../../services/Photographers/Validation';
import { isImagesClients } from '../../../types/types/ImageClients';
import { ValidationError } from '../../../types/classes/Errors';

class AttachClientsController extends Controller {
  constructor(
    private attachClientsService: AttachClientsService,
    private photographerValidation: PhotographerValidationService
  ) {
    super('/photographers');
    this.router.get('/getClients', tryCatch(this.getClients));
    this.router.post('/attachClients', tryCatch(this.attachClients));
  }

  private getClients = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;
    await this.photographerValidation.json(token);
    const clients = await this.attachClientsService.getClients();
    return res.status(200).json(clients);
  };

  private attachClients = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;
    await this.photographerValidation.json(token);
    const { imagesClients } = req.body;
    if (!isImagesClients(imagesClients)) throw new ValidationError('invalid image or clients');
    await this.attachClientsService.attachClients(imagesClients);
    return res.sendStatus(200);
  };
}

export default AttachClientsController;