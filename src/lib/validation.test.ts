import { describe, expect, it } from "vitest";
import { maxUploadBytes, normalizeNullable, tripInputSchema, validateUploadFile } from "@/lib/validation";

describe("tripInputSchema", () => {
  it("accepts valid trip input", () => {
    const result = tripInputSchema.parse({
      title: "Japan",
      slug: "japan-2026",
      location: "Tokyo",
      started_at: "2026-03-01",
      ended_at: "2026-03-08",
      description: "A spring trip",
      is_published: true
    });

    expect(result.title).toBe("Japan");
  });

  it("rejects invalid slugs and date order", () => {
    expect(() =>
      tripInputSchema.parse({
        title: "Japan",
        slug: "Japan 2026",
        started_at: "2026-03-08",
        ended_at: "2026-03-01"
      })
    ).toThrow();
  });
});

describe("upload validation", () => {
  it("allows supported image files under the max size", () => {
    const file = new File(["image"], "photo.webp", { type: "image/webp" });

    expect(validateUploadFile(file)).toBe(true);
  });

  it("rejects unsupported file types", () => {
    const file = new File(["pdf"], "doc.pdf", { type: "application/pdf" });

    expect(() => validateUploadFile(file)).toThrow("Unsupported image type");
  });

  it("rejects files larger than 25MB", () => {
    const oversized = new File([new Uint8Array(maxUploadBytes + 1)], "photo.jpg", { type: "image/jpeg" });

    expect(() => validateUploadFile(oversized)).toThrow("Image is too large");
  });
});

describe("normalizeNullable", () => {
  it("converts empty text to null", () => {
    expect(normalizeNullable("   ")).toBeNull();
    expect(normalizeNullable(" Hanoi ")).toBe("Hanoi");
  });
});
