export type ImageClients = {
  image: { id: string; albumId: number };
  clientsId: number[];
};

export const isImageClients = (obj: unknown): obj is ImageClients => {
  if (!obj || typeof obj !== 'object') return false;

  return obj.hasOwnProperty('image') && obj.hasOwnProperty('clientsId');
};

export const isImagesClients = (obj: unknown): obj is ImageClients[] => {
  if (!Array.isArray(obj)) return false;
  for (let i = 0; i < obj.length; i++) {
    if (!isImageClients(obj[i])) return false;
  }
  return true;
};
