import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { Photographers } from '../../db/schema/photographers';

export type NewPhotographer = InferInsertModel<typeof Photographers>;

export type Photographer = InferSelectModel<typeof Photographers>;

export function isNewPhotographer(obj: unknown): obj is NewPhotographer {
  if (!obj || typeof obj !== 'object') return false;

  const expectedFields: { [key: string]: string[] } = {
    login: ['string'],
    password: ['string'],
    id: ['number', 'undefined'],
    fullname: ['string', 'object', 'undefined'],
    email: ['string', 'object', 'undefined'],
  };
  const requiredFileds = ['login', 'password'];

  const objFields = Object.keys(obj);

  return (
    objFields.every((field) => Object.keys(expectedFields).includes(field)) &&
    requiredFileds.every((field) => objFields.includes(field)) &&
    objFields.every((field) => {
      const fieldType = typeof (obj as { [key: string]: unknown })[field];
      return expectedFields[field].includes(fieldType);
    })
  );
}
