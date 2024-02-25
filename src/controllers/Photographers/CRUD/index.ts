import Controller from '../../Controller';
import { Request, Response } from 'express';
import PhotographersService from '../../../services/Photographers/CRUD';
import { isNewPhotographer } from '../../../types/types/Photographer';
import tryCatch from '../../../tryCatch';
import { AuthorizationError, ValidationError } from '../../../types/classes/Errors';
import AdminValidationService from '../../../services/Admin/Validation';
import PhotographerValidationService from '../../../services/Photographers/Validation';
import { adminTokenHandler } from '../adminTokenHandler';
import { photographerTokenHandler } from '../photographerTokenHandler';
import { NewPhotographerSchema } from './validation';
class PhotographersController extends Controller {
  constructor(
    private photographers: PhotographersService,
    private adminValidation: AdminValidationService,
    private photographerValidation: PhotographerValidationService
  ) {
    super('/photographers');
    this.router.get('/', tryCatch(adminTokenHandler), tryCatch(this.getAll));
    this.router.get('/albums', tryCatch(photographerTokenHandler), tryCatch(this.getAllAlbums));
    this.router.delete('/:id', tryCatch(adminTokenHandler), tryCatch(this.deleteOne));
    this.router.post('/', tryCatch(adminTokenHandler), tryCatch(this.insertOne));
  }

  private getAll = async (req: Request, res: Response) => {
    const photographers = await this.photographers.getAll();
    return res.status(200).json(photographers);
  };

  private deleteOne = async (req: Request, res: Response) => {
    const { id: idStr } = req.params;
    const id = Number(idStr);
    if (isNaN(id)) {
      throw new ValidationError('id should be a number');
    }
    await this.photographers.deleteOne(id);
    return res.sendStatus(200);
  };

  private insertOne = async (req: Request, res: Response) => {
    const { login, email, password, fullname, id } = req.body;
    const photograph = { login, email, password, fullname, id };

    NewPhotographerSchema.parse(photograph);

    await this.photographers.insertOne(photograph);
    return res.sendStatus(200);
  };

  private getAllAlbums = async (req: Request, res: Response) => {
    const { id } = res.locals.user;
    const albums = await this.photographers.getAllAlbums(id);
    return res.status(200).json(albums);
  };
}

export default PhotographersController;
