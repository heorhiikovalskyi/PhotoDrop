import { z } from 'zod';

export const CodeVerifySchema = z.object({
  code: z.string(),
  number: z.string(),
});
