import { AlbumsRepository } from '../../../repositories/Albums';
import ImagesRepository from '../../../repositories/Images';
import { Album, AlbumImages } from './types';
import { Image } from './types';
import S3 from '../../s3';
import 'dotenv/config';
import { ServerError } from '../../../types/classes/Errors';
import { ClientsRepository } from '../../../repositories/Clients';

const { IMAGES_BUCKET, EDITED_IMAGES_BUCKET } = process.env;

if (!(IMAGES_BUCKET && EDITED_IMAGES_BUCKET)) {
  throw new Error('env is not full');
}

class ClientDowndloadService {
  constructor(
    private albums: AlbumsRepository,
    private images: ImagesRepository,
    private s3: S3,
    private clients: ClientsRepository
  ) {}

  public getAlbums = async (clientId: number) => {
    const result = await this.albums.getByClient(clientId);
    const albums: Album[] = [];
    result.forEach((e) => {
      const { AlbumsClients, Albums } = e;
      if (Albums) {
        const { paid } = AlbumsClients;
        const { name, date, location, id } = Albums;
        albums.push({ paid, name, date, location, id });
      }
    });
    return albums;
  };

  private getImagesUrls = async (images: Image[]) => {
    const urls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const bucket = image.paid ? IMAGES_BUCKET : EDITED_IMAGES_BUCKET;
      if (!bucket) throw new ServerError();
      const { albumId, id } = image;
      let key = `album/${albumId}/${id}`;
      key += image.paid ? `` : '_watermark';
      urls.push(await this.s3.getImageUrl(bucket, key));
    }
    return urls;
  };

  private getPreviewsUrls = async (images: Image[]) => {
    const urls: string[] = [];
    const bucket = EDITED_IMAGES_BUCKET;
    if (!bucket) throw new ServerError();
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const { albumId, id } = image;
      let key = `album/${albumId}/${id}`;
      key += '_blured';
      urls.push(await this.s3.getImageUrl(bucket, key));
    }
    return urls;
  };

  public getAlbumImages = async (clientId: number, albumId: number) => {
    const result = await this.images.getByAlbumClient(albumId, clientId);
    const images: Image[] = [];

    result.forEach((e) => {
      const { AlbumsClients, Images, Albums } = e;
      if (Albums && AlbumsClients && Images) {
        const { paid, albumId } = AlbumsClients;
        const { id } = Images;
        images.push({ paid, id, albumId, url: '', preview: '' });
      }
    });

    const imagesUrls = await this.getImagesUrls(images);

    const previewsUrls = await this.getPreviewsUrls(images);

    for (let i = 0; i < images.length; i++) {
      images[i].url = imagesUrls[i];
      images[i].preview = previewsUrls[i];
    }

    const album = result[0].Albums;

    const paid = result[0].AlbumsClients?.paid;

    return { album: { ...album, paid }, images };
  };

  public getImages = async (clientId: number) => {
    const result = await this.images.getByClient(clientId);
    const images: Image[] = [];

    result.forEach((e) => {
      const { ImagesClients, AlbumsClients, Images } = e;
      const { imageId } = ImagesClients;
      if (AlbumsClients && Images) {
        const { paid, albumId } = AlbumsClients;
        images.push({ paid, albumId, id: imageId, url: '', preview: '' });
      }
    });
    const imagesUrls = await this.getImagesUrls(images);

    const previewsUrls = await this.getPreviewsUrls(images);

    for (let i = 0; i < images.length; i++) {
      images[i].url = imagesUrls[i];
      images[i].preview = previewsUrls[i];
    }

    return images;
  };

  public getAvatar = async (clientId: number) => {
    const result = await this.clients.getSelfie(clientId);
    const selfieId = result.selfieId;
    if (!selfieId) return { id: null, url: null };
    const bucket = IMAGES_BUCKET;
    if (!bucket) throw new ServerError();
    const url = await this.s3.getImageUrl(IMAGES_BUCKET, `selfie/${clientId}/${selfieId}`);
    return { id: selfieId, url };
  };
}

export default ClientDowndloadService;
