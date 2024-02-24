import { z } from 'zod';

export const NewAlbumSchema = z.object({
  date: z.string(),
  name: z.string(),
  location: z.string(),
  photographerId: z.number(),
  id: z.number().optional(),
});

export const ImagesSchema = z.array(z.object({ albumId: z.string(), type: z.string(), name: z.string() }));
