import { ClientsRepository } from '../../../repositories/Clients';
import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import ClientValidationService from '../../../services/Clients/Validation';
import { ValidationError } from '../../../types/classes/Errors';
import ClientDowndloadService from '../../../services/Clients/Download/Download';
import { clientTokenHandler } from '../tokenHandler';
class ClientsController extends Controller {
  constructor(private clients: ClientsRepository, private clientDownload: ClientDowndloadService) {
    super('/clients');
    this.router.get('/', tryCatch(clientTokenHandler), tryCatch(this.getById));
  }
  private getById = async (req: Request, res: Response) => {
    const { clientId } = res.locals.user;

    const client = await this.clients.getById(clientId);

    const { selfieId } = client;

    let selfieUrl: string | null = null;

    if (selfieId) selfieUrl = (await this.clientDownload.getAvatar(clientId)).url;

    return res.status(200).json({ client: { ...client, selfieUrl } });
  };
}

export default ClientsController;
