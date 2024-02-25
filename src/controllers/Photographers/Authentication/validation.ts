import { z } from 'zod';

export const UserSchema = z.object({
  password: z.object({ password: z.string(), login: z.string() }),
});
