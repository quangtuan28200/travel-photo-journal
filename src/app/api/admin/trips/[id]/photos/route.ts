import { apiError } from "@/lib/api";
import { PublicApiError } from "@/lib/errors";
import { requireAdminForApi } from "@/lib/admin";
import { processImage } from "@/lib/images";
import { buildPhotoKey, cleanupR2Objects, createPhotoId, uploadR2Object } from "@/lib/r2";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { validateUploadFile } from "@/lib/validation";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Props) {
  const { response } = await requireAdminForApi();

  if (response) {
    return response;
  }

  try {
    const { id: tripId } = await params;
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);

    if (!files.length) {
      throw new PublicApiError("No images selected");
    }

    const supabase = createSupabaseAdminClient();
    const { data: trip, error: tripError } = await supabase.from("trips").select("id").eq("id", tripId).single();

    if (tripError || !trip) {
      throw new PublicApiError("Trip not found");
    }

    const { data: lastPhoto, error: lastPhotoError } = await supabase
      .from("photos")
      .select("sort_order")
      .eq("trip_id", tripId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastPhotoError) {
      throw new Error(lastPhotoError.message);
    }

    let nextSortOrder = ((lastPhoto?.sort_order as number | null | undefined) ?? -1) + 1;
    const createdPhotos = [];

    for (const file of files) {
      const uploadedKeys: string[] = [];

      validateUploadFile(file);

      const photoId = createPhotoId();
      const buffer = Buffer.from(await file.arrayBuffer());
      const processed = await processImage(buffer);
      const originalKey = buildPhotoKey(tripId, photoId, "original");
      const largeKey = buildPhotoKey(tripId, photoId, "large");
      const thumbKey = buildPhotoKey(tripId, photoId, "thumb");

      try {
        await uploadR2Object(originalKey, processed.original, "image/webp");
        uploadedKeys.push(originalKey);
        await uploadR2Object(largeKey, processed.large, "image/webp");
        uploadedKeys.push(largeKey);
        await uploadR2Object(thumbKey, processed.thumb, "image/webp");
        uploadedKeys.push(thumbKey);

        const { data, error } = await supabase
          .from("photos")
          .insert({
            id: photoId,
            trip_id: tripId,
            r2_original_key: originalKey,
            r2_large_key: largeKey,
            r2_thumb_key: thumbKey,
            width: processed.width,
            height: processed.height,
            blur_data_url: processed.blurDataUrl,
            sort_order: nextSortOrder
          })
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        createdPhotos.push(data);
        nextSortOrder += 1;
      } catch (error) {
        await cleanupR2Objects(uploadedKeys);
        throw error;
      }
    }

    return Response.json({ photos: createdPhotos }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not upload photos");
  }
}
