import { describe, expect, it } from "vitest";
import { buildPhotoKey } from "@/lib/r2-key";

describe("buildPhotoKey", () => {
  it("creates stable namespaced keys for photo variants", () => {
    expect(buildPhotoKey("trip-1", "photo-2", "thumb")).toBe("trips/trip-1/photo-2/thumb.webp");
  });

  it("strips unsafe characters from ids", () => {
    expect(buildPhotoKey("trip/1", "../photo-2", "large")).toBe("trips/trip1/photo-2/large.webp");
  });
});
