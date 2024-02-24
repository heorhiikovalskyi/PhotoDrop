import { z } from 'zod';

export const CodeVerifySchema = z.object({
  password: z.object({ code: z.string(), number: z.string() }),
});
