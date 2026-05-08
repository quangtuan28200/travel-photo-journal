import { apiError } from "@/lib/api";
import { normalizeNullable, tripInputSchema } from "@/lib/validation";
import { requireAdminForApi } from "@/lib/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { response } = await requireAdminForApi();

  if (response) {
    return response;
  }

  try {
    const input = tripInputSchema.parse(await request.json());
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("trips")
      .insert({
        title: input.title,
        slug: input.slug,
        location: normalizeNullable(input.location),
        started_at: normalizeNullable(input.started_at),
        ended_at: normalizeNullable(input.ended_at),
        description: normalizeNullable(input.description),
        is_published: input.is_published
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return Response.json({ trip: data }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not create trip");
  }
}
