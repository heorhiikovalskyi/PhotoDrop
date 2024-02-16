import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

const { DB_CONNECTION } = process.env;

const queryClient = postgres(DB_CONNECTION!);
export const db = drizzle(queryClient, { logger: true });
