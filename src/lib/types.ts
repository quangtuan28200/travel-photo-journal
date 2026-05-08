export type Trip = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  started_at: string | null;
  ended_at: string | null;
  description: string | null;
  cover_photo_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Photo = {
  id: string;
  trip_id: string;
  r2_original_key: string;
  r2_large_key: string;
  r2_thumb_key: string;
  width: number | null;
  height: number | null;
  blur_data_url: string | null;
  caption: string | null;
  taken_at: string | null;
  sort_order: number;
  created_at: string;
};

export type TripWithCover = Trip & {
  cover_photo: Photo | null;
  photo_count: number;
};

export type TripWithPhotos = Trip & {
  photos: Photo[];
};
