import { v4 as uuidv4 } from 'uuid';
import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import { ValidationError } from '../../../types/classes/Errors';
import 'dotenv/config';
import ClientValidationService from '../../../services/Clients/Validation';
import S3 from '../../../services/s3';
import ClientDowndloadService from '../../../services/Clients/Download/Download';
const { IMAGES_BUCKET } = process.env;

class ClientUploadController extends Controller {
  constructor(private clientValidation: ClientValidationService, private s3: S3) {
    super('/clients');
    this.router.post('/selfiesPresignedPost', tryCatch(this.presignedPost));
  }

  private presignedPost = async (req: Request, res: Response) => {
    const { contentType } = req.body;

    if (typeof contentType !== 'string') throw new ValidationError('wrong contentType');

    const { authorization: token } = req.headers;

    const decoded = await this.clientValidation.json(token);

    const clientId = decoded.id;

    const imageId = uuidv4();

    const post = await this.s3.presignedPost(3600, `selfie/${clientId}/${imageId}`, IMAGES_BUCKET!, contentType);

    const accessUrl = await this.s3.getImageUrl(IMAGES_BUCKET!, imageId);

    return res.status(200).json({ post, accessUrl });
  };
}

export default ClientUploadController;
