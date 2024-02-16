export type Description = {
  albumId: number;
  clientId: number;
};

export const isDescription = (obj: unknown): obj is Description => {
  if (!obj || typeof obj !== 'object') return false;
  if ('albumId' in obj && 'clientId' in obj) {
    return true;
  }
  return false;
};
