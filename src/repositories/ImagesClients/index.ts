import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { NewImage, Images } from '../../db/schema/images';
import { eq, and, sql } from 'drizzle-orm';
import { ImagesClients } from '../../db/schema/ImagesClients';
import { DataSource } from '../../types/types/DataSource';
import { NewImageClient } from '../../db/schema/ImagesClients';

export class ImagesClientsRepository {
  constructor(private db: PostgresJsDatabase) {}

  insertMany = async (imagesClients: NewImageClient[], dataSource: DataSource = this.db): Promise<void> => {
    await dataSource.insert(ImagesClients).values(imagesClients);
  };
}

export default ImagesClientsRepository;
