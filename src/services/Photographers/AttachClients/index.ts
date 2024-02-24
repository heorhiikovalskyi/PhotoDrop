import { ClientsRepository } from '../../../repositories/Clients';
import { NewImageClient } from '../../../db/schema/ImagesClients';
import ImagesClientsRepository from '../../../repositories/ImagesClients';
import { ImageClients } from '../../../controllers/Photographers/AttachClients/types';
import { AlbumsClientsRepository } from '../../../repositories/AlbumsClients';
import { NewAlbumClient } from '../../../db/schema/albumsClients';
import { db } from '../../../db/db';

class AttachClientsService {
  constructor(
    private clients: ClientsRepository,
    private imagesClients: ImagesClientsRepository,
    private albumsClients: AlbumsClientsRepository
  ) {}
  public getClients = async () => {
    return await this.clients.getAllClients();
  };

  public attachClients = async (imagesClients: ImageClients[]) => {
    const imagesClientsToInsert: NewImageClient[] = [];
    const albumsClients: NewAlbumClient[] = [];
    for (let i = 0; i < imagesClients.length; i++) {
      const { clientsId, image } = imagesClients[i];
      clientsId.forEach((clientId) => imagesClientsToInsert.push({ imageId: image.id, clientId }));
      clientsId.forEach((clientId) => albumsClients.push({ clientId, albumId: image.albumId, paid: false }));
    }
    await db.transaction(async (tx) => {
      await this.imagesClients.insertMany(imagesClientsToInsert, tx);
      await this.albumsClients.insertMany(albumsClients, tx);
    });
  };
}

export default AttachClientsService;
