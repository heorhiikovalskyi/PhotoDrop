import { z } from 'zod';

export const NewPhotographerSchema = z.object({
  password: z.string(),
  id: z.number().optional(),
  fullname: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
});
