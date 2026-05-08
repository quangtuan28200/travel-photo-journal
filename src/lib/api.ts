import { ZodError } from "zod";
import { PublicApiError } from "@/lib/errors";

export function apiError(error: unknown, fallback = "Request failed", status = 400) {
  if (error instanceof ZodError) {
    return Response.json({ error: error.errors[0]?.message ?? fallback }, { status });
  }

  if (error instanceof PublicApiError) {
    return Response.json({ error: error.message }, { status });
  }

  console.error(error);

  return Response.json({ error: fallback }, { status });
}
