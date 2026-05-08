import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth";
import { isMissingConfigError } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  let userEmail: string | null | undefined;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    userEmail = user?.email;
  } catch (error) {
    if (isMissingConfigError(error)) {
      return null;
    }

    throw error;
  }

  if (!isAdminEmail(userEmail)) {
    return null;
  }

  return { email: userEmail };
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export async function requireAdminForApi() {
  const user = await getAdminUser();

  if (!user) {
    return {
      user: null,
      response: Response.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  return {
    user,
    response: null
  };
}
