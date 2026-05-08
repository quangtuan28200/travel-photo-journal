import { describe, expect, it } from "vitest";
import { isAdminEmail } from "@/lib/auth";
import { parseAdminEmails } from "@/lib/config";

describe("admin email validation", () => {
  it("parses a comma-separated admin allowlist", () => {
    expect(parseAdminEmails("A@Example.com, b@example.com, ")).toEqual(["a@example.com", "b@example.com"]);
  });

  it("matches admin emails case-insensitively", () => {
    expect(isAdminEmail("ME@example.com", "me@example.com,other@example.com")).toBe(true);
  });

  it("rejects missing and non-allowlisted emails", () => {
    expect(isAdminEmail(null, "me@example.com")).toBe(false);
    expect(isAdminEmail("other@example.com", "me@example.com")).toBe(false);
  });
});
