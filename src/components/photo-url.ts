import { getPublicConfig } from "@/lib/config";

export function photoUrl(key: string) {
  const { r2PublicUrl } = getPublicConfig();

  return `${r2PublicUrl}/${key}`;
}
