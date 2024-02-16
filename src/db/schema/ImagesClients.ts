import { serial, pgTable, integer, text } from 'drizzle-orm/pg-core';
import { Clients } from './clients';
import { Images } from './images';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const ImagesClients = pgTable('ImagesClients', {
  id: serial('id').primaryKey(),
  imageId: text('imageId')
    .notNull()
    .references(() => Images.id),
  clientId: integer('clientId')
    .notNull()
    .references(() => Clients.id),
});

export type NewImageClient = InferInsertModel<typeof ImagesClients>;

export type ImageClient = InferSelectModel<typeof ImagesClients>;
