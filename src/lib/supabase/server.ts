import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getPublicConfig, getServerConfig } from "@/lib/config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const config = getPublicConfig();

  return createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}

export function createSupabaseAdminClient() {
  const config = getServerConfig();

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
