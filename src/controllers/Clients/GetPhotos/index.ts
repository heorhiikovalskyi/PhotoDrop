import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import 'dotenv/config';
import ClientValidationService from '../../../services/Clients/Validation';
import ClientDowndloadService from '../../../services/Clients/Download/Download';
import { ValidationError } from '../../../types/classes/Errors';

class ClientDownloadController extends Controller {
  constructor(private clientValidation: ClientValidationService, private clientDownload: ClientDowndloadService) {
    super('/clients');
    this.router.get('/getAlbums', tryCatch(this.getAlbums));
    this.router.get('/getImages', tryCatch(this.getImages));
    this.router.get('/getImagesByAlbumClient', tryCatch(this.getAlbumImages));
  }

  private getAlbums = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;

    const decoded = await this.clientValidation.json(token);

    const clientId = decoded.id;

    const albums = await this.clientDownload.getAlbums(clientId);

    return res.status(200).json(albums);
  };

  private getImages = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;

    const decoded = await this.clientValidation.json(token);

    const clientId = decoded.id;

    const images = await this.clientDownload.getImages(clientId);

    return res.status(200).json(images);
  };

  private getAlbumImages = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;

    const decoded = await this.clientValidation.json(token);

    const clientId = decoded.id;

    const { albumId } = req.query;

    if (typeof Number(albumId) !== 'number') throw new ValidationError('albumId is not valid');

    const images = await this.clientDownload.getAlbumImages(clientId, Number(albumId));

    return res.status(200).json(images);
  };
}

export default ClientDownloadController;
