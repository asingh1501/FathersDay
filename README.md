# For Papa — a private digital memory book

A responsive, story-driven Father’s Day website built with Next.js, TypeScript, Tailwind CSS, Framer Motion, Sharp, and local-only photo processing.

## Quick start

```bash
npm install
npm run process-photos
npm run dev
```

Open `http://localhost:3000`. Production checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

## Add and process photographs

Place originals under `original-photos/`. Each first-level folder becomes an album; nested paths are retained. Files directly inside the folder become the **Family Memories** album.

```text
original-photos/
  Childhood/
  Family Trips/
    Colorado/
  Papa and Me/
```

Run:

```bash
npm run process-photos
```

The recursive processor recognizes mixed-case JPG, JPEG, PNG, WebP, AVIF, GIF, TIFF, HEIC, and HEIF extensions. Sharp corrects EXIF orientation and writes 480px, 1200px, and 2400px WebP copies to `public/generated-photos/`. Re-encoding deliberately removes EXIF, GPS, owner, device, and serial metadata. The public manifest retains only dimensions and the capture date when one exists—never GPS. Originals are never edited or deleted.

Files are content-hashed for exact duplicate detection and collision-safe names. A hash/mtime cache at `scripts/.photo-cache.json` avoids unchanged work. Failed files are reported while the remaining queue continues. Delete only that cache and `public/generated-photos/` if a clean rebuild is required.

### HEIC / HEIF troubleshooting

Sharp uses its local libvips decoder first. On macOS, the processor automatically falls back to the built-in `sips` command. If neither can decode a file, install one of these local tools and rerun processing:

```bash
brew install imagemagick libheif
```

No photograph is uploaded or sent to an API. Some unusual or damaged HEIC variants may first need local conversion in Preview/ImageMagick.

### Live Photos

Matching still/video basenames are recognized as Live Photo pairs; the still is always processed normally. Video publishing is intentionally opt-in because video files can carry metadata and dramatically increase deployment size. To prepare a local browser-safe video with FFmpeg:

```bash
brew install ffmpeg
ffmpeg -i "original-photos/Album/IMG_0001.MOV" -map_metadata -1 -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart "public/generated-photos/Album/img-0001-live.mp4"
```

Then assign its public path to `livePhotoVideoSrc` in the manifest-generation customization if you choose to expose it. Do not copy unprocessed MOV files into `public/`.

## Personalize the book

Edit only [`src/data/site-content.ts`](src/data/site-content.ts) for personal writing and selections. It contains the introduction, Papa’s name, subtitle, final letter, signature, quote, qualities, music settings, photo edits, and album edits.

After processing, the command prints stable photo IDs. Use them in:

- `heroPhotoId` and `finalPhotoId` to choose opening/closing images.
- `featuredPhotoIds` for full editorial memory spreads.
- `portraitPhotoIds` for “Papa through the years.”
- `hiddenPhotoIds` to omit a photograph without deleting it.
- `photoOverrides[id]` to add `caption`, accurate `alt`, `memory`, `location`, `date`, `order`, or `featured`.
- `albumOverrides[album-id]` to set `title`, `description`, `order`, or `coverPhotoId`.

The generated fallback alt text explicitly asks for a human-written description instead of inventing photo contents. Rerun `npm run process-photos` after editing configuration or adding files.

### Optional music

Music is off by default and never autoplays. Add audio you have permission to use at `public/music/our-song.mp3`, then set `musicEnabled: true`. The visible control remembers volume only for the browser session. Do not commit copyrighted music without permission.

## Privacy and deployment

Originals are excluded by `.gitignore`; only stripped, optimized derivatives belong in a deployment. Verify staged files before every commit:

```bash
git status
git diff --cached --name-only
```

The site ships `robots.txt` plus `noindex, nofollow` metadata. **Noindex is not access control.** Anyone with the deployed URL may still access public files. For a private family site, place the entire deployment behind real server-side authentication or a hosting-platform access gate (for example Cloudflare Access, Vercel deployment protection, Netlify password protection, or an authenticated reverse proxy). A client-side password prompt is not secure and is intentionally not included. Do not add analytics or image CDNs unless their privacy implications are acceptable.

Generated photos and the manifest are ignored by default to prevent accidental publication. For a private deployment, either build a local deployment artifact that includes them or deliberately stage only the stripped copies (never `original-photos/`):

```bash
git add -f public/generated-photos src/data/photo-manifest.json
```

Hosted builds do not need the private originals. When no source images are present, the build preserves the deliberately committed generated manifest and assets.

## Behavior and maintenance

- Grids load responsive 480/1200px assets lazily; the hero alone receives priority. The lightbox requests 2400px copies only when opened.
- The accessible lightbox traps focus, locks background scrolling, supports Escape/arrows, touch drag, and visible controls.
- All major motion honors `prefers-reduced-motion`.
- Empty folders, missing dates/captions, absent music, and failed display images have visible fallbacks.
- Large albums initially show 36 images and reveal 24 more per tap until every photograph is visible. Responsive images remain lazy-loaded to control network cost.

If conversion fails, read every `FAILED` line in the processing report, verify the file opens locally, install the HEIC dependencies above, and rerun the exact command. Unsupported and unmatched video files are counted but never exposed automatically.
