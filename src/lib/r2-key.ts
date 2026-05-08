export type ImageVariant = "original" | "large" | "thumb";

export function buildPhotoKey(tripId: string, photoId: string, variant: ImageVariant, extension = "webp") {
  const safeTripId = tripId.replace(/[^a-zA-Z0-9-]/g, "");
  const safePhotoId = photoId.replace(/[^a-zA-Z0-9-]/g, "");

  return `trips/${safeTripId}/${safePhotoId}/${variant}.${extension}`;
}
