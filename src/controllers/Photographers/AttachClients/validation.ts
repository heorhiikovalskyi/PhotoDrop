import { z } from 'zod';

export const ImagesClientsSchema = z
  .object({
    image: z.object({
      id: z.string(),
      albumId: z.number(),
    }),
    clientsId: z.array(z.number()),
  })
  .array();
