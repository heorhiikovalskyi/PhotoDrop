import { z } from 'zod';

export const AlbumSchema = z.object({ albumId: z.string(), albumName: z.string() });
