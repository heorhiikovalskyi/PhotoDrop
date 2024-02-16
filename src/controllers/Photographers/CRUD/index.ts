import Controller from '../../Controller';
import { Request, Response } from 'express';
import PhotographersService from '../../../services/Photographers/CRUD';
import { isNewPhotographer } from '../../../types/types/Photographer';
import tryCatch from '../../../tryCatch';
import { AuthorizationError, ValidationError } from '../../../types/classes/Errors';
import AdminValidationService from '../../../services/Admin/Validation';
import PhotographerValidationService from '../../../services/Photographers/Validation';

class PhotographersController extends Controller {
  constructor(
    private photographers: PhotographersService,
    private adminValidation: AdminValidationService,
    private photographerValidation: PhotographerValidationService
  ) {
    super('/photographers');
    this.router.get('/', tryCatch(this.getAll));
    this.router.delete('/:id', tryCatch(this.deleteOne));
    this.router.post('/', tryCatch(this.insertOne));
    this.router.get('/albums', tryCatch(this.getAllAlbums));
  }

  private getAll = async (req: Request, res: Response) => {
    console.log(req.headers);
    console.log(req);
    const { authorization: token } = req.headers;
    await this.adminValidation.json(token);
    const photographers = await this.photographers.getAll();
    return res.status(200).json(photographers);
  };

  private deleteOne = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;
    await this.adminValidation.json(token);
    const { id: idStr } = req.params;
    const id = Number(idStr);
    if (isNaN(id)) {
      throw new ValidationError('id should be a number');
    }
    await this.photographers.deleteOne(id);
    return res.sendStatus(200);
  };

  private insertOne = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;
    await this.adminValidation.json(token);
    const { login, email, password, fullname, id, flag } = req.body;
    console.log(typeof flag);
    const photograph = { login, email, password, fullname, id };
    if (!isNewPhotographer(photograph)) {
      throw new ValidationError('wrong photograph data');
    }

    await this.photographers.insertOne(photograph);
    return res.sendStatus(200);
  };

  private getAllAlbums = async (req: Request, res: Response) => {
    const { authorization: token } = req.headers;
    const decoded = await this.photographerValidation.json(token);
    const albums = await this.photographers.getAllAlbums(decoded.id);
    return res.status(200).json(albums);
  };
}

export default PhotographersController;
