import { serial, pgTable, integer, boolean, unique } from 'drizzle-orm/pg-core';
import { Albums } from './albums';
import { Clients } from './clients';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const AlbumsClients = pgTable(
  'AlbumsClients',
  {
    id: serial('id').primaryKey(),
    albumId: integer('albumId')
      .notNull()
      .references(() => Albums.id),
    clientId: integer('clientId')
      .notNull()
      .references(() => Clients.id),
    paid: boolean('paid').notNull(),
  },
  (table) => {
    return {
      unqAlbumClient: unique().on(table.albumId, table.clientId),
    };
  }
);

export type NewAlbumClient = InferInsertModel<typeof AlbumsClients>;

export type AlbumClient = InferSelectModel<typeof AlbumsClients>;
