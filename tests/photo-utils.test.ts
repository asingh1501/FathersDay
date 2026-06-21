import { describe, expect, it } from "vitest";
import { albumFor, isSupportedImage, normalizeFilename, sortPhotos, uniqueByHash } from "../scripts/photo-utils";

describe("photo processing utilities", () => {
  it("detects supported formats case-insensitively", () => { expect(isSupportedImage("Papa.HEIC")).toBe(true); expect(isSupportedImage("scan.TiFf")).toBe(true); expect(isSupportedImage("notes.pdf")).toBe(false); });
  it("creates URL-safe stable names", () => { expect(normalizeFilename("Papa’s Birthday (2026)!.JPG")).toBe("papas-birthday-2026-jpg"); });
  it("preserves nested album folders", () => { expect(albumFor("Trips/Colorado/day-one.jpg")).toEqual({ id: "trips-colorado", title: "Trips / Colorado", directory: "Trips/Colorado" }); });
  it("detects exact duplicate hashes", () => { expect(uniqueByHash([{ hash: "a", n: 1 }, { hash: "a", n: 2 }, { hash: "b", n: 3 }]).map((x) => x.n)).toEqual([1, 3]); });
  it("sorts dated items first and handles missing metadata stably", () => { const result = sortPhotos([{ originalFilename: "10.jpg" }, { originalFilename: "2.jpg" }, { originalFilename: "dated.jpg", capturedAt: "2020-01-01" }]); expect(result.map((x) => x.originalFilename)).toEqual(["dated.jpg", "2.jpg", "10.jpg"]); });
});
