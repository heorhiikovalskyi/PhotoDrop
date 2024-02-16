import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Selfie, NewSelfie, Selfies } from '../../db/schema/selfies';
import { DataSource } from '../../types/types/DataSource';

export class SelfiesRepository {
  constructor(private db: PostgresJsDatabase) {}

  insertOne = async (selfie: NewSelfie, dataSource: DataSource = this.db): Promise<Selfie> => {
    return (await dataSource.insert(Selfies).values(selfie).returning())[0];
  };
}
