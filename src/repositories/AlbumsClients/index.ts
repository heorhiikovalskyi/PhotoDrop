import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Albums, NewAlbum, Album } from '../../db/schema/albums';
import { DataSource } from '../../types/types/DataSource';
import { eq, and } from 'drizzle-orm';
import { ImagesClients } from '../../db/schema/ImagesClients';
import { Images } from '../../db/schema/images';
import { NewAlbumClient, AlbumsClients, AlbumClient } from '../../db/schema/albumsClients';
import { sql } from 'drizzle-orm';

export class AlbumsClientsRepository {
  constructor(private db: PostgresJsDatabase) {}

  insertMany = async (albumsClients: NewAlbumClient[], dataSource: DataSource = this.db): Promise<AlbumClient[]> => {
    return await dataSource
      .insert(AlbumsClients)
      .values(albumsClients)
      .onConflictDoNothing({ target: [AlbumsClients.albumId, AlbumsClients.clientId] })
      .returning();
  };

  getByClient = async (clientId: number, dataSource: DataSource = this.db): Promise<AlbumClient[]> => {
    return await dataSource.select().from(AlbumsClients);
  };

  updatePaid = async (clientId: number, albumId: number, dataSource: DataSource = this.db): Promise<AlbumClient[]> => {
    return await dataSource
      .update(AlbumsClients)
      .set({ paid: true })
      .where(and(eq(AlbumsClients.albumId, albumId), eq(AlbumsClients.clientId, clientId)))
      .returning();
  };
}
