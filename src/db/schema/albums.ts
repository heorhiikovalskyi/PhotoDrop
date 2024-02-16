import { serial, text, pgTable, unique, date, integer } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { Photographers } from './photographers';

export const Albums = pgTable(
  'Albums',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    location: text('location').notNull(),
    date: date('date').notNull(),
    photographerId: integer('photographerId')
      .notNull()
      .references(() => Photographers.id),
  },
  (table) => {
    return {
      unqName: unique().on(table.name),
    };
  }
);

export type NewAlbum = InferInsertModel<typeof Albums>;

export type Album = InferSelectModel<typeof Albums>;
