import { serial, text, pgTable, unique, AnyPgColumn } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { Selfies } from './selfies';
export const Clients = pgTable(
  'Clients',
  {
    id: serial('id').primaryKey(),
    number: text('number').notNull(),
    selfieId: text('selfieId').references((): AnyPgColumn => Selfies.id),
    name: text('name'),
    email: text('email'),
  },
  (table) => {
    return {
      unqNumber: unique().on(table.number),
      unqEmail: unique().on(table.email),
    };
  }
);

export type NewClient = InferInsertModel<typeof Clients>;

export type Client = InferSelectModel<typeof Clients>;
