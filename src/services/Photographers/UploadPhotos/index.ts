import { NewAlbum } from '../../../db/schema/albums';
import { AlbumsRepository } from '../../../repositories/Albums';
import { S3Client } from '@aws-sdk/client-s3';
import { ValidationError } from '../../../types/classes/Errors';

class PhotographerUploadService {
  constructor(private albumsRepo: AlbumsRepository, private s3Client: S3Client) {}

  public insertAlbum = async (album: NewAlbum) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(album.date)) throw new ValidationError('date isn`t valid');
    return await this.albumsRepo.insertOne(album);
  };
}

export default PhotographerUploadService;
