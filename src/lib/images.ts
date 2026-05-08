import sharp from "sharp";

export type ProcessedImage = {
  original: Buffer;
  large: Buffer;
  thumb: Buffer;
  width: number;
  height: number;
  blurDataUrl: string | null;
};

export async function processImage(buffer: Buffer): Promise<ProcessedImage> {
  const image = sharp(buffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  const original = await image.webp({ quality: 92 }).toBuffer();
  const large = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toBuffer();
  const thumb = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();
  const blur = await sharp(buffer, { failOn: "none" }).rotate().resize(16).webp({ quality: 30 }).toBuffer();

  return {
    original,
    large,
    thumb,
    width,
    height,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`
  };
}
