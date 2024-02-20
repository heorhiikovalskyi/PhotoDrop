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
import { isImages } from './types';
import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { photographerTokenHandler } from '../photographerTokenHandler';

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
    if (typeof name !== 'string' || typeof location !== 'string' || typeof date !== 'string')
      throw new ValidationError('invalid album data');

    const album = { name, location, date, photographerId };
    const newAlbum = await this.photographerUpload.insertAlbum(album);
    return res.status(200).json(newAlbum);
  };

  private presignedPost = async (req: Request, res: Response) => {
    const { images } = req.body;

    if (!isImages(images)) throw new ValidationError('albums error');

    const posts: { post: PresignedPost; realName: string }[] = [];

    for (let i = 0; i < images.length; i++) {
      const { albumId, type, name } = images[i];
      const imageId = uuidv4();
      posts.push({
        post: await this.s3.presignedPost(3600, `album/${albumId}/${imageId}`, IMAGES_BUCKET!, type),
        realName: name,
      });
    }

    return res.status(200).json(posts);
  };
}

export default PhotographerUploadController;
