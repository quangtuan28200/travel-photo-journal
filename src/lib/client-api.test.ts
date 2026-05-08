import { describe, expect, it, vi } from "vitest";
import { ClientApiError, getClientErrorMessage, requestJson } from "@/lib/client-api";

describe("requestJson", () => {
  it("returns parsed JSON for successful responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ trip: { id: "trip-1" } })));

    await expect(requestJson<{ trip: { id: string } }>("/api/trips", {}, "Could not load")).resolves.toEqual({
      trip: { id: "trip-1" }
    });
  });

  it("throws public API error messages for failed responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "Title is required" }, { status: 400 })));

    await expect(requestJson("/api/trips", {}, "Could not save")).rejects.toThrow(
      new ClientApiError("Title is required")
    );
  });

  it("uses the fallback when a failed response is not valid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Service unavailable", { status: 503 }))
    );

    await expect(requestJson("/api/trips", {}, "Could not save")).rejects.toThrow(
      new ClientApiError("Could not save")
    );
  });

  it("uses the fallback when the request cannot be sent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(requestJson("/api/trips", {}, "Could not save")).rejects.toThrow(
      new ClientApiError("Could not save")
    );
  });
});

describe("getClientErrorMessage", () => {
  it("returns client API error messages", () => {
    expect(getClientErrorMessage(new ClientApiError("No images selected"), "Could not upload")).toBe(
      "No images selected"
    );
  });

  it("does not expose unexpected internal error messages", () => {
    expect(getClientErrorMessage(new Error("database password leaked"), "Could not upload")).toBe(
      "Could not upload"
    );
  });
});
