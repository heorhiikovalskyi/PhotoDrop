import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import 'dotenv/config';
import ClientValidationService from '../../../services/Clients/Validation';
import ClientDowndloadService from '../../../services/Clients/Download/Download';
import { ValidationError } from '../../../types/classes/Errors';
import { clientTokenHandler } from '../tokenHandler';

class ClientDownloadController extends Controller {
  constructor(private clientValidation: ClientValidationService, private clientDownload: ClientDowndloadService) {
    super('/clients');
    this.router.get('/getAlbums', tryCatch(clientTokenHandler), tryCatch(this.getAlbums));
    this.router.get('/getImages', tryCatch(clientTokenHandler), tryCatch(this.getImages));
    this.router.get('/getImagesByAlbumClient', tryCatch(clientTokenHandler), tryCatch(this.getAlbumImages));
  }

  private getAlbums = async (req: Request, res: Response) => {
    const { clientId } = res.locals.user;

    const albums = await this.clientDownload.getAlbums(clientId);

    return res.status(200).json(albums);
  };

  private getImages = async (req: Request, res: Response) => {
    const { clientId } = res.locals.user;

    const images = await this.clientDownload.getImages(clientId);

    return res.status(200).json(images);
  };

  private getAlbumImages = async (req: Request, res: Response) => {
    const { clientId } = res.locals.user;

    const { albumId } = req.query;

    if (typeof Number(albumId) !== 'number') throw new ValidationError('albumId is not valid');

    const images = await this.clientDownload.getAlbumImages(clientId, Number(albumId));

    return res.status(200).json(images);
  };
}

export default ClientDownloadController;
