import { ClientsRepository } from '../../../repositories/Clients';
import { NewImageClient } from '../../../db/schema/ImagesClients';
import ImagesClientsRepository from '../../../repositories/ImagesClients';
import { ImageClients } from '../../../types/types/ImageClients';
import { AlbumsClientsRepository } from '../../../repositories/AlbumsClients';
import { NewAlbumClient } from '../../../db/schema/albumsClients';

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
    for (let i = 0; i < imagesClients.length; i++) {
      const { clientsId, image } = imagesClients[i];
      const imagesClientsToInsert: NewImageClient[] = [];
      clientsId.forEach((clientId) => imagesClientsToInsert.push({ imageId: image.id, clientId }));
      await this.imagesClients.insertMany(imagesClientsToInsert);
      const albumsClients: NewAlbumClient[] = [];
      clientsId.forEach((clientId) => albumsClients.push({ clientId, albumId: image.albumId, paid: false }));
      await this.albumsClients.insertMany(albumsClients);
    }
  };
}

export default AttachClientsService;
