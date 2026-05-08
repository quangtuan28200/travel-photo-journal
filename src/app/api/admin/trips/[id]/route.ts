import { apiError } from "@/lib/api";
import { requireAdminForApi } from "@/lib/admin";
import { deleteR2Object } from "@/lib/r2";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { normalizeNullable, tripInputSchema } from "@/lib/validation";
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
    const input = tripInputSchema.parse(await request.json());
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("trips")
      .update({
        title: input.title,
        slug: input.slug,
        location: normalizeNullable(input.location),
        started_at: normalizeNullable(input.started_at),
        ended_at: normalizeNullable(input.ended_at),
        description: normalizeNullable(input.description),
        is_published: input.is_published,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return Response.json({ trip: data });
  } catch (error) {
    return apiError(error, "Could not update trip");
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
    const { data: photos, error: photoError } = await supabase.from("photos").select("*").eq("trip_id", id);

    if (photoError) {
      throw new Error(photoError.message);
    }

    for (const photo of (photos ?? []) as Photo[]) {
      await Promise.all([
        deleteR2Object(photo.r2_original_key),
        deleteR2Object(photo.r2_large_key),
        deleteR2Object(photo.r2_thumb_key)
      ]);
    }

    const { error } = await supabase.from("trips").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error, "Could not delete trip");
  }
}
