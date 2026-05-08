import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/redirect";

describe("safeRedirectPath", () => {
  it("allows internal absolute paths", () => {
    expect(safeRedirectPath("/admin/trips/new")).toBe("/admin/trips/new");
  });

  it("rejects absolute external URLs", () => {
    expect(safeRedirectPath("https://evil.example/phish")).toBe("/admin");
  });

  it("rejects protocol-relative URLs", () => {
    expect(safeRedirectPath("//evil.example/phish")).toBe("/admin");
  });

  it("falls back for missing or relative paths", () => {
    expect(safeRedirectPath(null)).toBe("/admin");
    expect(safeRedirectPath("admin")).toBe("/admin");
  });
});
