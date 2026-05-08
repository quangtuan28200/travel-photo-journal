import { ZodError } from "zod";

export function apiError(error: unknown, fallback = "Request failed", status = 400) {
  if (error instanceof ZodError) {
    return Response.json({ error: error.errors[0]?.message ?? fallback }, { status });
  }

  if (error instanceof Error) {
    return Response.json({ error: error.message }, { status });
  }

  return Response.json({ error: fallback }, { status });
}
