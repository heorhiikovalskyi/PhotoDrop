import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { Photographer, NewPhotographer, Photographers } from '../../db/schema/photographers';
import { DataSource } from '../../types/types/DataSource';

export class PhotographersRepository {
  constructor(private db: PostgresJsDatabase) {}

  getAll = async (): Promise<Photographer[]> => {
    return await this.db.select().from(Photographers);
  };

  deleteOne = async (id: number, dataSource: DataSource = this.db) => {
    return await dataSource.delete(Photographers).where(eq(Photographers.id, id));
  };

  insertOne = async (photographer: NewPhotographer, dataSource: DataSource = this.db) => {
    return await dataSource.insert(Photographers).values(photographer);
  };

  getByLogin = async (login: string) => {
    return await this.db.select().from(Photographers).where(eq(Photographers.login, login));
  };
}
