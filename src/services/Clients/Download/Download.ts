import { AlbumsRepository } from '../../../repositories/Albums';
import ImagesRepository from '../../../repositories/Images';
import { Album, AlbumImages, DetailedAlbum } from './types';
import { Image } from './types';
import S3 from '../../s3';
import 'dotenv/config';
import { ServerError } from '../../../types/classes/Errors';
import { ClientsRepository } from '../../../repositories/Clients';
import { ValidationError } from '../../../types/classes/Errors';

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

  public getDetailedAlbum = async (clientId: number, albumId: number) => {
    const album = await this.albums.getByIdAndClient(albumId, clientId);
    const images = await this.images.getByAlbumClient(albumId, clientId);
    if (!album) throw new ValidationError('No such album for this client');
    const { AlbumsClients } = album;
    const { Images } = images[0];
    const { paid } = AlbumsClients;
    const detailedAlbum: DetailedAlbum = { album: { ...album.Albums, paid }, image: { url: '', preview: '' } };
    if (Images) {
      const image = { paid, ...Images };
      const [[imageUrl], [preview]] = await Promise.all([this.getImagesUrls([image]), this.getPreviewsUrls([image])]);
      detailedAlbum.image = { url: imageUrl, preview };
    }
    return detailedAlbum;
  };

  public getAlbums = async (clientId: number) => {
    const result = await this.albums.getByClient(clientId);
    const albums: Album[] = [];
    result.forEach((e) => {
      const { AlbumsClients, Albums } = e;
      const { paid } = AlbumsClients;
      const { name, date, location, id } = Albums;
      albums.push({ paid, name, date, location, id });
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
      const { paid, albumId } = AlbumsClients;
      const { id } = Images;
      images.push({ paid, id, albumId, url: '', preview: '' });
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
      const { paid, albumId } = AlbumsClients;
      images.push({ paid, albumId, id: imageId, url: '', preview: '' });
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
