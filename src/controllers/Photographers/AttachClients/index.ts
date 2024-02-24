import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import AttachClientsService from '../../../services/Photographers/AttachClients';
import { Request, Response } from 'express';
import PhotographerValidationService from '../../../services/Photographers/Validation';
import { ValidationError } from '../../../types/classes/Errors';
import { photographerTokenHandler } from '../photographerTokenHandler';
import { ImagesClientsSchema } from './zod';

class AttachClientsController extends Controller {
  constructor(
    private attachClientsService: AttachClientsService,
    private photographerValidation: PhotographerValidationService
  ) {
    super('/photographers');
    this.router.get('/getClients', tryCatch(photographerTokenHandler), tryCatch(this.getClients));
    this.router.post('/attachClients', tryCatch(photographerTokenHandler), tryCatch(this.attachClients));
  }

  private getClients = async (req: Request, res: Response) => {
    const clients = await this.attachClientsService.getClients();
    return res.status(200).json(clients);
  };

  private attachClients = async (req: Request, res: Response) => {
    const { imagesClients } = req.body;
    ImagesClientsSchema.parse(imagesClients);
    await this.attachClientsService.attachClients(imagesClients);
    return res.sendStatus(200);
  };
}

export default AttachClientsController;
