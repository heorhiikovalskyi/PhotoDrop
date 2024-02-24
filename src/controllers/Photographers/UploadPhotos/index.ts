import { v4 as uuidv4 } from 'uuid';
import Controller from '../../Controller';
import tryCatch from '../../../tryCatch';
import { Request, Response } from 'express';
import { ValidationError } from '../../../types/classes/Errors';
import PhotographerUploadService from '../../../services/Photographers/UploadPhotos';
import 'dotenv/config';
import PhotographerValidationService from '../../../services/Photographers/Validation';
import S3 from '../../../services/s3';
import { Image } from './types';
import { ImagesSchema } from './zod';
import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { photographerTokenHandler } from '../photographerTokenHandler';
import { NewAlbumSchema } from './zod';

const { IMAGES_BUCKET } = process.env;

class PhotographerUploadController extends Controller {
  constructor(
    private photographerUpload: PhotographerUploadService,
    private photographerValidation: PhotographerValidationService,
    private s3: S3
  ) {
    super('/photographers');
    this.router.post('/uploadAlbum', tryCatch(photographerTokenHandler), tryCatch(this.saveAlbum));
    this.router.post('/imagesPresignedPost', tryCatch(photographerTokenHandler), tryCatch(this.presignedPost));
  }

  private saveAlbum = async (req: Request, res: Response) => {
    const { id: photographerId } = res.locals.user;
    const { name, location, date } = req.body;

    const album = { name, location, date, photographerId };

    NewAlbumSchema.parse(album);

    const newAlbum = await this.photographerUpload.insertAlbum(album);
    return res.status(200).json(newAlbum);
  };

  private presignedPost = async (req: Request, res: Response) => {
    const { images_ } = req.body;

    const images = ImagesSchema.parse(images_);

    const posts = await Promise.all(
      images.map(async (image) => {
        const { albumId, type, name } = image;
        const imageId = uuidv4();
        return {
          post: await this.s3.presignedPost(3600, `album/${albumId}/${imageId}`, IMAGES_BUCKET!, type),
          realName: name,
        };
      })
    );

    return res.status(200).json(posts);
  };
}

export default PhotographerUploadController;
