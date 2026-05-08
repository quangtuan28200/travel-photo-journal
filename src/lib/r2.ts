import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "node:crypto";
import { getServerConfig } from "@/lib/config";
export { buildPhotoKey } from "@/lib/r2-key";

export function createR2Client() {
  const config = getServerConfig();

  return new S3Client({
    region: "auto",
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey
    }
  });
}

export function createPhotoId() {
  return crypto.randomUUID();
}

export function publicPhotoUrl(key: string) {
  const { r2PublicUrl } = getServerConfig();

  return `${r2PublicUrl}/${key}`;
}

export async function uploadR2Object(key: string, body: Buffer, contentType: string) {
  const config = getServerConfig();
  const client = createR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: config.r2BucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable"
    })
  );
}

export async function deleteR2Object(key: string) {
  const config = getServerConfig();
  const client = createR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.r2BucketName,
      Key: key
    })
  );
}

export async function cleanupR2Objects(keys: string[]) {
  const results = await Promise.allSettled(keys.map((key) => deleteR2Object(key)));
  const failures = results.filter((result) => result.status === "rejected");

  if (failures.length) {
    console.error("Failed to clean up R2 objects", failures);
  }

  return failures.length;
}
