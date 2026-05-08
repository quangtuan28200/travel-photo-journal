import { parseAdminEmails } from "@/lib/config";

export function isAdminEmail(email: string | null | undefined, allowedEmails = process.env.ADMIN_EMAILS ?? "") {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const admins = parseAdminEmails(allowedEmails);

  return admins.includes(normalizedEmail);
}
