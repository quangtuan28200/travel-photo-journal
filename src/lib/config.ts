function readEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function isMissingConfigError(error: unknown) {
  return error instanceof Error && error.message.endsWith("is not configured");
}

export function getPublicConfig() {
  return {
    supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    r2PublicUrl: readEnv("R2_PUBLIC_URL").replace(/\/$/, "")
  };
}

export function getServerConfig() {
  return {
    ...getPublicConfig(),
    supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
    r2AccountId: readEnv("R2_ACCOUNT_ID"),
    r2AccessKeyId: readEnv("R2_ACCESS_KEY_ID"),
    r2SecretAccessKey: readEnv("R2_SECRET_ACCESS_KEY"),
    r2BucketName: readEnv("R2_BUCKET_NAME"),
    adminEmails: parseAdminEmails(process.env.ADMIN_EMAILS ?? "")
  };
}

export function parseAdminEmails(value: string): string[] {
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
