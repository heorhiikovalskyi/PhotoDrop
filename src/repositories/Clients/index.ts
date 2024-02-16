import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Client, NewClient, Clients } from '../../db/schema/clients';
import { eq } from 'drizzle-orm';
import { DataSource } from '../../types/types/DataSource';

export class ClientsRepository {
  constructor(private db: PostgresJsDatabase) {}

  insertOne = async (client: NewClient, dataSource: DataSource = this.db): Promise<Client> => {
    return (await dataSource.insert(Clients).values(client).returning())[0];
  };

  updateSelfie = async (selfie: string, clientId: number, dataSource: DataSource = this.db): Promise<Client> => {
    return (await dataSource.update(Clients).set({ selfieId: selfie }).where(eq(Clients.id, clientId)).returning())[0];
  };

  getAllClients = async (dataSource: DataSource = this.db): Promise<{ number: string; id: number }[]> => {
    return await dataSource.select({ number: Clients.number, id: Clients.id }).from(Clients);
  };

  getSelfie = async (clientId: number, dataSource: DataSource = this.db): Promise<{ selfieId: string | null }> => {
    return (await dataSource.select({ selfieId: Clients.selfieId }).from(Clients).where(eq(Clients.id, clientId)))[0];
  };

  getByNumber = async (number: string, dataSource: DataSource = this.db) => {
    return (await dataSource.select().from(Clients).where(eq(Clients.number, number)))[0];
  };

  updateName = async (clientId: number, name: string, dataSource: DataSource = this.db): Promise<Client> => {
    return (await dataSource.update(Clients).set({ name }).where(eq(Clients.id, clientId)).returning())[0];
  };

  updateEmail = async (clientId: number, email: string, dataSource: DataSource = this.db): Promise<Client> => {
    return (await dataSource.update(Clients).set({ email }).where(eq(Clients.id, clientId)).returning())[0];
  };

  getById = async (clientId: number, dataSource: DataSource = this.db): Promise<Client> => {
    return (await dataSource.select().from(Clients).where(eq(Clients.id, clientId)))[0];
  };
}
