export type Image = {
  albumId: string;
  type: string;
  name: string;
};

export const isImage = (obj: unknown): obj is Image => {
  if (!obj || typeof obj !== 'object') return false;
  if ('albumId' in obj && 'type' in obj && 'name' in obj) {
    return true;
  }
  return false;
};

export const isImages = (obj: unknown): obj is Image[] => {
  if (!Array.isArray(obj)) return false;
  for (let i = 0; i < obj.length; i++) {
    if (!isImage(obj[i])) return false;
  }
  return true;
};
