import path from "node:path";

export const IMAGE_EXTENSIONS = new Set([".heic", ".heif", ".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".gif"]);
export const VIDEO_EXTENSIONS = new Set([".mov", ".mp4", ".m4v"]);

export function isSupportedImage(filename: string) {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

export function normalizeFilename(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "photo";
}

export function albumFor(relativeFile: string) {
  const dir = path.dirname(relativeFile);
  const raw = dir === "." ? "Family Memories" : dir.split(path.sep).join(" / ");
  return { id: normalizeFilename(raw), title: raw, directory: dir === "." ? "" : dir };
}

export function sortPhotos<T extends { capturedAt?: string; originalFilename: string }>(photos: T[]) {
  return [...photos].sort((a, b) => {
    if (a.capturedAt && b.capturedAt) return a.capturedAt.localeCompare(b.capturedAt);
    if (a.capturedAt) return -1;
    if (b.capturedAt) return 1;
    return a.originalFilename.localeCompare(b.originalFilename, undefined, { numeric: true });
  });
}

export function uniqueByHash<T extends { hash: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => !seen.has(item.hash) && Boolean(seen.add(item.hash)));
}
