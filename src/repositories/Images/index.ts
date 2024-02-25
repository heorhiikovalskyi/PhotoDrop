import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { NewImage, Images } from '../../db/schema/images';
import { eq, and } from 'drizzle-orm';
import { ImagesClients } from '../../db/schema/ImagesClients';
import { DataSource } from '../../types/types/DataSource';
import { AlbumsClients } from '../../db/schema/albumsClients';
import { Albums } from '../../db/schema/albums';

export class ImagesRepository {
  constructor(private db: PostgresJsDatabase) {}

  deleteOne = async (imageId: string, dataSource: DataSource = this.db): Promise<void> => {
    await dataSource.delete(Images).where(eq(Images.id, imageId));
  };

  insertOne = async (image: NewImage, dataSource: DataSource = this.db): Promise<void> => {
    await dataSource.insert(Images).values(image);
  };

  getByAlbum = async (albumId: number) => {
    return await this.db.select().from(Images).where(eq(Images.albumId, albumId));
  };

  getByAlbumClient = async (albumId: number, clientId: number) => {
    return await this.db
      .select()
      .from(ImagesClients)
      .innerJoin(Images, eq(Images.id, ImagesClients.imageId))
      .innerJoin(
        AlbumsClients,
        and(eq(Images.albumId, AlbumsClients.albumId), eq(ImagesClients.clientId, AlbumsClients.clientId))
      )
      .where(and(eq(ImagesClients.clientId, clientId), eq(AlbumsClients.albumId, albumId)))
      .innerJoin(Albums, eq(Albums.id, albumId));
  };

  getByClient = async (clientId: number) => {
    return await this.db
      .select()
      .from(ImagesClients)
      .innerJoin(Images, eq(Images.id, ImagesClients.imageId))
      .innerJoin(
        AlbumsClients,
        and(eq(Images.albumId, AlbumsClients.albumId), eq(ImagesClients.clientId, AlbumsClients.clientId))
      )
      .where(eq(ImagesClients.clientId, clientId));
  };
}

export default ImagesRepository;
