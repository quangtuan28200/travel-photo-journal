import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("creates lowercase url-safe slugs", () => {
    expect(slugify("Đà Nẵng Summer Trip 2026!")).toBe("da-nang-summer-trip-2026");
  });

  it("removes duplicate separators", () => {
    expect(slugify("  Hanoi --- Sapa  ")).toBe("hanoi-sapa");
  });
});
