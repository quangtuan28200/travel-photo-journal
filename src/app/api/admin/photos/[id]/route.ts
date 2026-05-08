import { apiError } from "@/lib/api";
import { requireAdminForApi } from "@/lib/admin";
import { cleanupR2Objects } from "@/lib/r2";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { normalizeNullable, photoPatchSchema } from "@/lib/validation";
import type { Photo } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  const { response } = await requireAdminForApi();

  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const input = photoPatchSchema.parse(await request.json());
    const supabase = createSupabaseAdminClient();
    const { data: photo, error: fetchError } = await supabase.from("photos").select("*").eq("id", id).single();

    if (fetchError || !photo) {
      throw new Error(fetchError?.message ?? "Photo not found");
    }

    const { data, error } = await supabase
      .from("photos")
      .update({
        caption: input.caption === undefined ? (photo as Photo).caption : normalizeNullable(input.caption),
        sort_order: input.sort_order ?? (photo as Photo).sort_order
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (input.set_as_cover) {
      const { error: coverError } = await supabase
        .from("trips")
        .update({
          cover_photo_id: id,
          updated_at: new Date().toISOString()
        })
        .eq("id", (photo as Photo).trip_id);

      if (coverError) {
        throw new Error(coverError.message);
      }
    }

    return Response.json({ photo: data });
  } catch (error) {
    return apiError(error, "Could not update photo");
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const { response } = await requireAdminForApi();

  if (response) {
    return response;
  }

  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { data: photo, error: fetchError } = await supabase.from("photos").select("*").eq("id", id).single();

    if (fetchError || !photo) {
      throw new Error(fetchError?.message ?? "Photo not found");
    }

    const typedPhoto = photo as Photo;

    const { error } = await supabase.from("photos").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    const cleanupFailures = await cleanupR2Objects([
      typedPhoto.r2_original_key,
      typedPhoto.r2_large_key,
      typedPhoto.r2_thumb_key
    ]);

    return Response.json({ ok: true, cleanupFailures });
  } catch (error) {
    return apiError(error, "Could not delete photo");
  }
}
