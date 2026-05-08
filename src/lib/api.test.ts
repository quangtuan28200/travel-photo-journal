import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { apiError } from "@/lib/api";
import { PublicApiError } from "@/lib/errors";

describe("apiError", () => {
  it("returns public validation messages", async () => {
    const response = apiError(new PublicApiError("Unsupported image type"), "Could not upload");

    await expect(response.json()).resolves.toEqual({ error: "Unsupported image type" });
  });

  it("returns zod validation messages", async () => {
    const response = apiError(new ZodError([]), "Invalid input");

    await expect(response.json()).resolves.toEqual({ error: "Invalid input" });
  });

  it("does not expose internal error messages", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = apiError(new Error("duplicate key value violates unique constraint trips_slug_key"), "Could not save trip");

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Could not save trip" });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
