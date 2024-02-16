import { serial, text, pgTable, unique } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const Photographers = pgTable(
  'photographers',
  {
    id: serial('id').primaryKey(),
    login: text('login').notNull(),
    password: text('password').notNull(),
    fullname: text('fullname'),
    email: text('email'),
  },
  (table) => {
    return {
      unqLogin: unique().on(table.login),
      unqEmail: unique().on(table.email),
    };
  }
);

export type NewPhotographer = InferInsertModel<typeof Photographers>;

export type Photographer = InferSelectModel<typeof Photographers>;
