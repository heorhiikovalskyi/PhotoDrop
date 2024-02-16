import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './db';

export const migrateDb = async () => {
  await migrate(db, { migrationsFolder: 'src/db/migrations' });
};
