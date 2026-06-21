"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight, Heart, Images, Quote, RotateCcw, Sparkles, Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { siteContent } from "@/src/data/site-content";
import type { Album, PhotoItem, PhotoManifest } from "@/src/types/photos";
import { Lightbox } from "./Lightbox";
import { MusicControl } from "./MusicControl";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

function formatDate(value?: string) { if (!value) return "A moment worth keeping"; return new Intl.DateTimeFormat("en", { year: "numeric", month: "long" }).format(new Date(value)); }

function AlbumChapter({ album, albumIndex, open }: { album: Album; albumIndex: number; open: (photo: PhotoItem) => void }) {
  const initialCount = 36;
  const pageSize = 24;
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const photos = album.photos.slice(0, visibleCount);
  const hasMore = visibleCount < album.photos.length;
  return <section className={`album chapter-${albumIndex % 3}`} aria-labelledby={`album-${album.id}`}>
    <Reveal className="chapter-heading"><p className="eyebrow">Chapter {String(albumIndex + 1).padStart(2, "0")}</p><h2 id={`album-${album.id}`}>{album.title}</h2><p>{album.description ?? `${album.photos.length} photographs from a chapter we will always remember.`}</p></Reveal>
    <div className="album-grid">{photos.map((photo, i) => <Reveal className={`photo-card card-${i % 7}`} key={photo.id}><button onClick={() => open(photo)} aria-label={`Open ${photo.caption ?? photo.originalFilename} in photo viewer`}><Photo photo={photo} sizes="(max-width: 700px) 92vw, 38vw" /><span className="photo-note">{photo.caption ?? (photo.capturedAt ? new Date(photo.capturedAt).getFullYear() : "Our story")}</span></button></Reveal>)}</div>
    {album.photos.length > initialCount && <div className="album-actions">
      {hasMore && <button className="text-button" onClick={() => setVisibleCount((count) => Math.min(count + pageSize, album.photos.length))}>Show more memories <span>{Math.min(pageSize, album.photos.length - visibleCount)} more</span> <ArrowRight aria-hidden /></button>}
      {visibleCount > initialCount && <button className="text-button secondary" onClick={() => { setVisibleCount(initialCount); document.getElementById(`album-${album.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>Return to first {initialCount}</button>}
    </div>}
  </section>;
}

function PortraitRail({ photos, open }: { photos: PhotoItem[]; open: (photo: PhotoItem) => void }) {
  const rail = useRef<HTMLDivElement>(null); const selected = photos.length ? photos : [];
  if (!selected.length) return null;
  return <section className="portraits section-pad" aria-labelledby="portraits-title"><Reveal><p className="eyebrow">A life in frames</p><h2 id="portraits-title">Papa through the years</h2></Reveal>
    <div className="portrait-rail" ref={rail} tabIndex={0} aria-label="Papa through the years; use arrow keys to scroll" onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") rail.current?.scrollBy({ left: e.key === "ArrowRight" ? 320 : -320, behavior: "smooth" }); }}>
      {selected.map((photo) => <button key={photo.id} className="contact-frame" onClick={() => open(photo)}><Photo photo={photo} sizes="280px" /><span>{photo.capturedAt ? new Date(photo.capturedAt).getFullYear() : "Then & now"}</span></button>)}
    </div>
  </section>;
}

export default function MemoryBook({ manifest }: { manifest: PhotoManifest }) {
  const { scrollYProgress } = useScroll(); const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const photos = manifest.photos; const hero = photos.find((p) => p.id === siteContent.heroPhotoId) ?? photos[0];
  const finalPhoto = photos.find((p) => p.id === siteContent.finalPhotoId) ?? photos.at(-1);
  const featured = photos.filter((p) => p.featured || siteContent.featuredPhotoIds.includes(p.id)).slice(0, 5);
  const portraitIds = siteContent.portraitPhotoIds.length ? siteContent.portraitPhotoIds : photos.filter((_, i) => i % Math.max(1, Math.floor(photos.length / 12)) === 0).slice(0, 12).map((p) => p.id);
  const portraits = portraitIds.map((id) => photos.find((p) => p.id === id)).filter(Boolean) as PhotoItem[];
  const timeline = useMemo(() => photos.filter((p) => p.capturedAt).filter((_, index, dated) => index % Math.max(1, Math.floor(dated.length / 10)) === 0).slice(0, 10), [photos]);
  const [lightbox, setLightbox] = useState<number | null>(null); const [egg, setEgg] = useState(false); const [celebrate, setCelebrate] = useState(false);
  const open = (photo: PhotoItem) => setLightbox(photos.findIndex((p) => p.id === photo.id));
  return <>
    <motion.div className="story-progress" style={{ scaleX: progress }} aria-hidden />
    {siteContent.musicEnabled && <MusicControl src={siteContent.musicSrc} />}
    <main id="top">
      <section className={`hero ${hero ? "has-photo" : ""}`} aria-labelledby="hero-title">
        {hero && <div className="hero-photo"><motion.div initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 2.2 }}><Photo photo={hero} sizes="100vw" priority /></motion.div></div>}
        <div className="hero-shade" aria-hidden /><motion.div className="hero-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .2 }}><p className="eyebrow">Father’s Day · {new Date(siteContent.fathersDayDate + "T12:00:00").getFullYear()}</p><h1 id="hero-title">{siteContent.pageTitle}</h1><p>{siteContent.subtitle}</p><a href="#our-story" className="scroll-cue">Begin our story <ArrowDown aria-hidden /></a></motion.div>
      </section>

      <section id="our-story" className="intro section-pad"><Reveal><p className="eyebrow">For {siteContent.dadName}</p><p className="intro-copy">{siteContent.introMessage}</p><div className="ornament" aria-hidden>✦</div></Reveal></section>

      {timeline.length > 0 && <section className="timeline section-pad" aria-labelledby="timeline-title"><Reveal><p className="eyebrow">Collected moments</p><h2 id="timeline-title">Our story, one frame at a time</h2></Reveal><div className="timeline-line">{timeline.map((photo, i) => <Reveal className={`timeline-item ${i % 2 ? "even" : "odd"}`} key={photo.id}><button onClick={() => open(photo)}><Photo photo={photo} sizes="(max-width: 700px) 86vw, 36vw" /></button><div><time>{formatDate(photo.capturedAt)}</time><h3>{photo.caption ?? photo.albumName}</h3><p>{photo.memory ?? "Some moments become part of the family story without anyone noticing at the time."}</p></div></Reveal>)}</div></section>}

      {manifest.albums.length ? manifest.albums.map((album, i) => <AlbumChapter key={album.id} album={album} albumIndex={i} open={open} />) : <section className="empty-state section-pad"><Images aria-hidden /><h2>Your memories are ready for their chapters.</h2><p>Add photographs to <code>original-photos/</code>, then run <code>npm run process-photos</code>.</p></section>}

      {featured.length > 0 && <section className="featured section-pad" aria-labelledby="featured-title"><Reveal><p className="eyebrow">Held a little closer</p><h2 id="featured-title">Favorite memories</h2></Reveal>{featured.map((photo) => <Reveal className="feature-spread" key={photo.id}><button className="feature-photo" onClick={() => open(photo)}><Photo photo={photo} sizes="(max-width: 700px) 92vw, 55vw" /></button><div><Quote aria-hidden /><p className="eyebrow">{formatDate(photo.capturedAt)}</p><h3>{photo.caption ?? "One for the memory book"}</h3><p>{photo.memory ?? "Add the story behind this photograph in site-content.ts."}</p><button className="favorite" aria-label="Mark this memory with a heart"><Heart aria-hidden /> A favorite</button></div></Reveal>)}</section>}

      <section className="qualities section-pad" aria-labelledby="qualities-title"><Reveal><p className="eyebrow">The things that matter</p><h2 id="qualities-title">Things we love about {siteContent.dadName}</h2></Reveal><div className="quality-grid">{siteContent.qualities.map((quality, i) => <Reveal className="quality-card" key={quality.title}><span>{i % 2 ? <Star aria-hidden /> : <Heart aria-hidden />}</span><h3>{quality.title}</h3><p>{quality.text}</p></Reveal>)}</div></section>

      <PortraitRail photos={portraits} open={open} />

      {siteContent.familyQuote && <section className="quote-section"><Reveal><Quote aria-hidden /><blockquote>{siteContent.familyQuote}</blockquote><button className="egg" onClick={() => setEgg(!egg)} aria-label="Reveal a hidden family message"><Sparkles aria-hidden /></button>{egg && <p className="egg-message">{siteContent.easterEggMessage}</p>}</Reveal></section>}

      <section className="letter section-pad" aria-labelledby="letter-title"><Reveal className="letter-paper"><div className="letter-copy"><p className="eyebrow">One last thing</p><h2 id="letter-title">{siteContent.finalLetterTitle}</h2><p>{siteContent.finalLetter}</p><p className="signature">{siteContent.signature}</p><p>{siteContent.closingLine}</p><button className="celebrate" onClick={() => setCelebrate(true)}><Heart aria-hidden /> Send Papa some love</button></div>{finalPhoto && <button className="letter-photo" onClick={() => open(finalPhoto)}><Photo photo={finalPhoto} sizes="(max-width: 700px) 82vw, 34vw" /></button>}</Reveal>{celebrate && <div className="confetti" role="status" aria-live="polite"><span>♥</span><span>✦</span><span>♥</span><span>✦</span><p>Happy Father’s Day, Papa.</p></div>}<a className="replay" href="#top"><RotateCcw aria-hidden /> Replay our memories</a></section>
    </main>
    <footer><p>Made with love, for {siteContent.dadName}.</p></footer>
    <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
  </>;
}
