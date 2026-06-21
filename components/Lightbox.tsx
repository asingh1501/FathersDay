"use client";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import type { PhotoItem } from "@/src/types/photos";
import { Photo } from "./Photo";

export function Lightbox({ photos, index, onClose, onIndex }: { photos: PhotoItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const open = index !== null; const photo = index === null ? null : photos[index];
  const move = useCallback((delta: number) => { if (index !== null) onIndex((index + delta + photos.length) % photos.length); }, [index, onIndex, photos.length]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (!open) return; if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [move, open]);
  return <AnimatePresence>{open && photo && <Dialog static open onClose={onClose} className="lightbox">
    <DialogBackdrop as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lightbox-backdrop" />
    <div className="lightbox-wrap"><DialogPanel as={motion.div} initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="lightbox-panel">
      <button className="lightbox-close" onClick={onClose} aria-label="Close photo viewer"><X /></button>
      <button className="lightbox-arrow left" onClick={() => move(-1)} aria-label="Previous photograph"><ChevronLeft /></button>
      <motion.div className="lightbox-image" drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 70) move(info.offset.x > 0 ? -1 : 1); }}>
        <Photo photo={{ ...photo, src: photo.largeSrc ?? photo.src, mediumSrc: photo.largeSrc }} sizes="100vw" />
      </motion.div>
      <button className="lightbox-arrow right" onClick={() => move(1)} aria-label="Next photograph"><ChevronRight /></button>
      <div className="lightbox-caption"><DialogTitle>{photo.caption ?? "A favorite memory"}</DialogTitle><p>{[photo.albumName, photo.capturedAt ? new Date(photo.capturedAt).getFullYear() : null, photo.location].filter(Boolean).join(" · ")}</p>{photo.memory && <p>{photo.memory}</p>}<span>{(index ?? 0) + 1} / {photos.length}</span></div>
    </DialogPanel></div>
  </Dialog>}</AnimatePresence>;
}
