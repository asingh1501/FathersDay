export type PhotoItem = {
  id: string;
  albumId: string;
  albumName: string;
  originalFilename: string;
  generatedFilename: string;
  src: string;
  thumbnailSrc?: string;
  mediumSrc?: string;
  largeSrc?: string;
  width: number;
  height: number;
  aspectRatio: number;
  capturedAt?: string;
  caption?: string;
  alt?: string;
  location?: string;
  memory?: string;
  featured?: boolean;
  livePhotoVideoSrc?: string;
};

export type Album = {
  id: string;
  title: string;
  description?: string;
  coverPhotoId?: string;
  order: number;
  photos: PhotoItem[];
};

export type PhotoManifest = { generatedAt: string; albums: Album[]; photos: PhotoItem[] };
