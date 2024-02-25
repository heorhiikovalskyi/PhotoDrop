import { z } from 'zod';

export const DescripotionSchema = z.object({ albumId: z.number(), clientId: z.number() });
