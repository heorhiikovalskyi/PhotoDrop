import { text, pgTable, integer } from 'drizzle-orm/pg-core';
import { Albums } from './albums';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
export const Images = pgTable('Images', {
  id: text('id').primaryKey(),
  albumId: integer('albumId')
    .references(() => Albums.id)
    .notNull(),
});

export type NewImage = InferInsertModel<typeof Images>;

export type Image = InferSelectModel<typeof Images>;
