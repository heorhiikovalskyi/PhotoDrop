import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Albums, NewAlbum, Album } from '../../db/schema/albums';
import { DataSource } from '../../types/types/DataSource';
import { eq, and } from 'drizzle-orm';
import { AlbumsClients } from '../../db/schema/albumsClients';
import { Images } from '../../db/schema/images';

export class AlbumsRepository {
  constructor(private db: PostgresJsDatabase) {}

  insertOne = async (album: NewAlbum, dataSource: DataSource = this.db): Promise<Album> => {
    return (await dataSource.insert(Albums).values(album).returning())[0];
  };

  getByPhotographer = async (photographerId: number, dataSource: DataSource = this.db): Promise<Album[]> => {
    return await dataSource.select().from(Albums).where(eq(Albums.photographerId, photographerId));
  };

  getByClient = async (clientId: number, dataSource: DataSource = this.db) => {
    return await dataSource
      .select()
      .from(AlbumsClients)
      .where(eq(AlbumsClients.clientId, clientId))
      .innerJoin(Albums, eq(Albums.id, AlbumsClients.albumId));
  };

  getByIdAndClient = async (albumId: number, clientId: number, dataSource: DataSource = this.db) => {
    return (
      await dataSource
        .select()
        .from(Albums)
        .where(eq(Albums.id, albumId))
        .innerJoin(AlbumsClients, and(eq(Albums.id, AlbumsClients.albumId), eq(AlbumsClients.clientId, clientId)))
    )[0];
  };
}
