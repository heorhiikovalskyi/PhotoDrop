export type Album = {
  paid: boolean;
  name: string;
  date: string;
  id: number;
  location: string;
};

export type Image = {
  paid: boolean;
  id: string;
  albumId: number;
  url: string;
  preview: string;
};

export type AlbumImages = {
  album: Album;
  images: Image[];
};
