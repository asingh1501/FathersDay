import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { siteContent } from "../src/data/site-content";
import type { Album, PhotoItem, PhotoManifest } from "../src/types/photos";
import { albumFor, isSupportedImage, normalizeFilename, sortPhotos, VIDEO_EXTENSIONS } from "./photo-utils";

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "original-photos");
const OUTPUT = path.join(ROOT, "public/generated-photos");
const MANIFEST = path.join(ROOT, "src/data/photo-manifest.json");
const CACHE_FILE = path.join(ROOT, "scripts/.photo-cache.json");
const PROCESSOR_VERSION = "2";
const sizes = { thumbnail: 480, medium: 1200, large: 2400 } as const;

type Cache = Record<string, { signature: string; item: PhotoItem }>;
type Report = { discovered: number; converted: number; skipped: number; duplicates: number; unsupported: number; failed: string[] };

async function walk(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const children = await Promise.all(entries.filter((e) => !e.name.startsWith(".")).map((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : Promise.resolve([full]);
  }));
  return children.flat();
}

async function hashFile(file: string) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

function publicPath(file: string) { return "/" + path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/"); }

async function convertInput(file: string, workDir: string): Promise<{ input: string; cleanup?: string }> {
  const ext = path.extname(file).toLowerCase();
  if (ext !== ".heic" && ext !== ".heif") return { input: file };
  try {
    // Metadata can succeed even when libvips lacks the actual compression decoder.
    await sharp(file).rotate().resize(1, 1).toBuffer();
    return { input: file };
  } catch {
    if (process.platform !== "darwin") throw new Error("HEIC decoder unavailable. Install ImageMagick/libheif; see README.");
    const fallback = path.join(workDir, "heic-fallback.jpg");
    try {
      execFileSync("sips", ["-s", "format", "jpeg", file, "--out", fallback], { stdio: "ignore" });
      return { input: fallback, cleanup: fallback };
    } catch { throw new Error("HEIC conversion failed with Sharp and macOS sips. See README."); }
  }
}

async function processOne(file: string, relative: string, hash: string, liveVideos: Map<string, string>): Promise<PhotoItem> {
  const album = albumFor(relative);
  const stem = normalizeFilename(path.basename(file, path.extname(file)));
  const id = `${album.id}-${stem}-${hash.slice(0, 10)}`;
  const dir = path.join(OUTPUT, album.directory, `${stem}-${hash.slice(0, 8)}`);
  await mkdir(dir, { recursive: true });
  const converted = await convertInput(file, dir);
  try {
    const capture = await import("exifr").then(({ default: exifr }) => exifr.parse(file, ["DateTimeOriginal", "CreateDate", "DateTimeDigitized"]).catch(() => undefined));
    const image = sharp(converted.input, { animated: false }).rotate().flatten({ background: "#f5f0e6" });
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) throw new Error("Image dimensions could not be read");
    const outputs: Record<keyof typeof sizes, string> = {} as Record<keyof typeof sizes, string>;
    await Promise.all(Object.entries(sizes).map(async ([name, width]) => {
      const target = path.join(dir, `${name}.webp`);
      await image.clone().resize({ width, height: width, fit: "inside", withoutEnlargement: true }).webp({ quality: name === "large" ? 88 : 82, effort: 4 }).toFile(target);
      outputs[name as keyof typeof sizes] = publicPath(target);
    }));
    const actual = await sharp(path.join(dir, "large.webp")).metadata();
    const key = path.join(path.dirname(relative), path.basename(relative, path.extname(relative))).toLowerCase();
    return {
      id, albumId: album.id, albumName: album.title, originalFilename: path.basename(file),
      generatedFilename: path.relative(OUTPUT, path.join(dir, "large.webp")).split(path.sep).join("/"),
      src: outputs.medium, thumbnailSrc: outputs.thumbnail, mediumSrc: outputs.medium, largeSrc: outputs.large,
      width: actual.width ?? metadata.width, height: actual.height ?? metadata.height,
      aspectRatio: (actual.width ?? metadata.width) / (actual.height ?? metadata.height),
      capturedAt: [capture?.DateTimeOriginal, capture?.CreateDate, capture?.DateTimeDigitized].find((date) => date instanceof Date)?.toISOString(),
      alt: `Family photograph from ${album.title}; add a description in site-content.ts`,
      livePhotoVideoSrc: liveVideos.has(key) ? undefined : undefined,
    };
  } finally { if (converted.cleanup) await rm(converted.cleanup, { force: true }); }
}

export function applyOverrides(manifest: PhotoManifest): PhotoManifest {
  const hidden = new Set(siteContent.hiddenPhotoIds);
  const photos = manifest.photos.filter((p) => !hidden.has(p.id) && !siteContent.photoOverrides[p.id]?.hidden).map((photo) => {
    const edit = siteContent.photoOverrides[photo.id];
    return { ...photo, caption: edit?.caption ?? photo.caption, alt: edit?.alt ?? photo.alt, memory: edit?.memory, location: edit?.location, capturedAt: edit?.date ?? photo.capturedAt, featured: edit?.featured ?? siteContent.featuredPhotoIds.includes(photo.id) };
  });
  const byId = new Map(photos.map((p) => [p.id, p]));
  const albums = manifest.albums.map((album) => {
    const edit = siteContent.albumOverrides[album.id];
    const albumPhotos = album.photos.map((p) => byId.get(p.id)).filter(Boolean) as PhotoItem[];
    albumPhotos.sort((a, b) => (siteContent.photoOverrides[a.id]?.order ?? 999999) - (siteContent.photoOverrides[b.id]?.order ?? 999999));
    return { ...album, title: edit?.title ?? album.title, description: edit?.description, order: edit?.order ?? album.order, coverPhotoId: edit?.coverPhotoId ?? album.coverPhotoId, photos: albumPhotos };
  }).filter((a) => a.photos.length).sort((a, b) => a.order - b.order);
  return { ...manifest, photos, albums };
}

async function main() {
  await mkdir(OUTPUT, { recursive: true });
  const files = await walk(INPUT);
  const sourceImages = files.filter(isSupportedImage);
  // Hosted builds intentionally do not receive private originals. In that case,
  // keep the deliberately committed generated assets/manifest instead of
  // replacing the memory book with an empty manifest.
  if (sourceImages.length === 0 && existsSync(MANIFEST)) {
    const existing = JSON.parse(await readFile(MANIFEST, "utf8")) as PhotoManifest;
    if (existing.photos.length > 0) {
      console.log(`No source photos present; preserving ${existing.photos.length} preprocessed photos for this hosted build.`);
      return;
    }
  }
  const report: Report = { discovered: files.length, converted: 0, skipped: 0, duplicates: 0, unsupported: 0, failed: [] };
  const oldCache: Cache = existsSync(CACHE_FILE) ? JSON.parse(await readFile(CACHE_FILE, "utf8")) : {};
  const cache: Cache = {}; const seen = new Set<string>(); const photos: PhotoItem[] = [];
  const liveVideos = new Map<string, string>();
  for (const file of files.filter((f) => VIDEO_EXTENSIONS.has(path.extname(f).toLowerCase()))) {
    const rel = path.relative(INPUT, file); liveVideos.set(path.join(path.dirname(rel), path.basename(rel, path.extname(rel))).toLowerCase(), file);
  }
  for (const file of files) {
    const relative = path.relative(INPUT, file);
    if (!isSupportedImage(file)) { if (!VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase())) report.unsupported++; continue; }
    try {
      const hash = await hashFile(file);
      if (seen.has(hash)) { report.duplicates++; continue; }
      seen.add(hash);
      const info = await stat(file); const signature = `${PROCESSOR_VERSION}:${hash}:${info.mtimeMs}:${info.size}`;
      let item = oldCache[relative]?.signature === signature && existsSync(path.join(ROOT, "public", oldCache[relative].item.largeSrc!.slice(1))) ? oldCache[relative].item : undefined;
      if (item) report.skipped++; else { item = await processOne(file, relative, hash, liveVideos); report.converted++; }
      cache[relative] = { signature, item }; photos.push(item);
    } catch (error) { report.failed.push(`${relative}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  const grouped = new Map<string, PhotoItem[]>();
  for (const photo of photos) grouped.set(photo.albumId, [...(grouped.get(photo.albumId) ?? []), photo]);
  const albums: Album[] = [...grouped.entries()].map(([id, list], order) => ({ id, title: list[0].albumName, order, coverPhotoId: sortPhotos(list)[0]?.id, photos: sortPhotos(list) }));
  const manifest = applyOverrides({ generatedAt: new Date().toISOString(), albums, photos: sortPhotos(photos) });
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n"); await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2) + "\n");
  console.log(`\nPhoto processing report\n  Discovered: ${report.discovered}\n  Converted: ${report.converted}\n  Cached/skipped: ${report.skipped}\n  Exact duplicates: ${report.duplicates}\n  Unsupported: ${report.unsupported}\n  Failed: ${report.failed.length}\n  Output: ${OUTPUT}`);
  report.failed.forEach((failure) => console.error(`  FAILED ${failure}`));
  if (photos.length) console.log(`\nPhoto IDs (use in src/data/site-content.ts):\n${photos.map((p) => `  ${p.id}  ${p.originalFilename}`).join("\n")}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
