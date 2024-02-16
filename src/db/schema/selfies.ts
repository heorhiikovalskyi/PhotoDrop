import { pgTable, integer, text } from 'drizzle-orm/pg-core';
import { Clients } from './clients';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const Selfies = pgTable('Selfies', {
  id: text('id').primaryKey(),
  clientId: integer('clientId')
    .notNull()
    .references(() => Clients.id),
});

export type NewSelfie = InferInsertModel<typeof Selfies>;

export type Selfie = InferSelectModel<typeof Selfies>;
