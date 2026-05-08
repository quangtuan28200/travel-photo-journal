import { createSupabaseAdminClient, createSupabasePublicClient } from "@/lib/supabase/server";
import { isMissingConfigError } from "@/lib/config";
import type { Photo, Trip, TripWithCover, TripWithPhotos } from "@/lib/types";

export async function getPublishedTrips(): Promise<TripWithCover[]> {
  let supabase;

  try {
    supabase = createSupabasePublicClient();
  } catch (error) {
    if (isMissingConfigError(error)) {
      return [];
    }

    throw error;
  }
  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .eq("is_published", true)
    .order("started_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw error;
  }

  if (!trips?.length) {
    return [];
  }

  const tripIds = trips.map((trip) => trip.id);
  const coverIds = trips.map((trip) => trip.cover_photo_id).filter(Boolean) as string[];
  const { data: photos, error: photoError } = await supabase
    .from("photos")
    .select("*")
    .in("trip_id", tripIds)
    .order("sort_order", { ascending: true });

  if (photoError) {
    throw photoError;
  }

  return trips.map((trip) => {
    const tripPhotos = (photos ?? []).filter((photo) => photo.trip_id === trip.id) as Photo[];
    const explicitCover = coverIds.length
      ? tripPhotos.find((photo) => photo.id === trip.cover_photo_id) ?? null
      : null;

    return {
      ...(trip as Trip),
      cover_photo: explicitCover ?? tripPhotos[0] ?? null,
      photo_count: tripPhotos.length
    };
  });
}

export async function getPublishedTripBySlug(slug: string): Promise<TripWithPhotos | null> {
  let supabase;

  try {
    supabase = createSupabasePublicClient();
  } catch (error) {
    if (isMissingConfigError(error)) {
      return null;
    }

    throw error;
  }
  const { data: trip, error } = await supabase
    .from("trips")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !trip) {
    return null;
  }

  const { data: photos, error: photoError } = await supabase
    .from("photos")
    .select("*")
    .eq("trip_id", trip.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (photoError) {
    throw photoError;
  }

  return {
    ...(trip as Trip),
    photos: (photos ?? []) as Photo[]
  };
}

export async function getAdminTrips(): Promise<TripWithCover[]> {
  const supabase = createSupabaseAdminClient();
  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  if (!trips?.length) {
    return [];
  }

  const tripIds = trips.map((trip) => trip.id);
  const { data: photos, error: photoError } = await supabase
    .from("photos")
    .select("*")
    .in("trip_id", tripIds)
    .order("sort_order", { ascending: true });

  if (photoError) {
    throw photoError;
  }

  return trips.map((trip) => {
    const tripPhotos = (photos ?? []).filter((photo) => photo.trip_id === trip.id) as Photo[];

    return {
      ...(trip as Trip),
      cover_photo: tripPhotos.find((photo) => photo.id === trip.cover_photo_id) ?? tripPhotos[0] ?? null,
      photo_count: tripPhotos.length
    };
  });
}

export async function getAdminTrip(id: string): Promise<TripWithPhotos | null> {
  const supabase = createSupabaseAdminClient();
  const { data: trip, error } = await supabase.from("trips").select("*").eq("id", id).single();

  if (error || !trip) {
    return null;
  }

  const { data: photos, error: photoError } = await supabase
    .from("photos")
    .select("*")
    .eq("trip_id", id)
    .order("sort_order", { ascending: true });

  if (photoError) {
    throw photoError;
  }

  return {
    ...(trip as Trip),
    photos: (photos ?? []) as Photo[]
  };
}
