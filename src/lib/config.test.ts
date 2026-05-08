import { afterEach, describe, expect, it, vi } from "vitest";
import { getPublicConfig, getServerConfig } from "@/lib/config";

describe("environment config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads public configuration and trims the R2 public url", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    vi.stubEnv("R2_PUBLIC_URL", "https://photos.example.com/");

    expect(getPublicConfig()).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon",
      r2PublicUrl: "https://photos.example.com"
    });
  });

  it("reads server-only configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service");
    vi.stubEnv("ADMIN_EMAILS", "me@example.com");
    vi.stubEnv("R2_ACCOUNT_ID", "account");
    vi.stubEnv("R2_ACCESS_KEY_ID", "key");
    vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret");
    vi.stubEnv("R2_BUCKET_NAME", "bucket");
    vi.stubEnv("R2_PUBLIC_URL", "https://photos.example.com");

    expect(getServerConfig()).toMatchObject({
      supabaseServiceRoleKey: "service",
      r2BucketName: "bucket",
      adminEmails: ["me@example.com"]
    });
  });

  it("throws when required configuration is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");

    expect(() => getPublicConfig()).toThrow("NEXT_PUBLIC_SUPABASE_URL is not configured");
  });
});
