import { z } from "zod";
import { PublicApiError } from "@/lib/errors";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateOnly(value: string | null | undefined) {
  if (!value) {
    return true;
  }

  if (!dateOnlyPattern.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const optionalDateSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine(isValidDateOnly, "Use YYYY-MM-DD dates");

export const tripInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required")
      .max(140)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
    location: z.string().trim().max(120).optional().nullable(),
    started_at: optionalDateSchema,
    ended_at: optionalDateSchema,
    description: z.string().trim().max(4000).optional().nullable(),
    is_published: z.boolean().default(false)
  })
  .refine(
    (value) => {
      if (!value.started_at || !value.ended_at) {
        return true;
      }

      return value.started_at <= value.ended_at;
    },
    {
      message: "End date must be after start date",
      path: ["ended_at"]
    }
  );

export const photoPatchSchema = z.object({
  caption: z.string().trim().max(500).optional().nullable(),
  sort_order: z.number().int().min(0).max(100000).optional(),
  set_as_cover: z.boolean().optional()
});

export const maxUploadBytes = 25 * 1024 * 1024;

export const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export function validateUploadFile(file: File) {
  if (file.size > maxUploadBytes) {
    throw new PublicApiError("Image is too large. Maximum size is 25MB.");
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new PublicApiError("Unsupported image type. Use JPEG, PNG, WebP, HEIC, or HEIF.");
  }

  return true;
}

export function normalizeNullable(value: string | null | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}
