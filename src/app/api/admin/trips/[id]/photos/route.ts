import { apiError } from "@/lib/api";
import { requireAdminForApi } from "@/lib/admin";
import { processImage } from "@/lib/images";
import { buildPhotoKey, createPhotoId, uploadR2Object } from "@/lib/r2";
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
      return Response.json({ error: "No images selected" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const createdPhotos = [];

    for (const file of files) {
      validateUploadFile(file);

      const photoId = createPhotoId();
      const buffer = Buffer.from(await file.arrayBuffer());
      const processed = await processImage(buffer);
      const originalKey = buildPhotoKey(tripId, photoId, "original");
      const largeKey = buildPhotoKey(tripId, photoId, "large");
      const thumbKey = buildPhotoKey(tripId, photoId, "thumb");

      await Promise.all([
        uploadR2Object(originalKey, processed.original, "image/webp"),
        uploadR2Object(largeKey, processed.large, "image/webp"),
        uploadR2Object(thumbKey, processed.thumb, "image/webp")
      ]);

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
          sort_order: Date.now()
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      createdPhotos.push(data);
    }

    return Response.json({ photos: createdPhotos }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not upload photos");
  }
}
