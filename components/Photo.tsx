"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import type { PhotoItem } from "@/src/types/photos";

export function Photo({ photo, sizes, priority = false, className = "" }: { photo: PhotoItem; sizes: string; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`photo-fallback ${className}`} role="img" aria-label="This photograph could not be loaded"><ImageOff aria-hidden /><span>Photograph unavailable</span></div>;
  return <Image className={className} src={photo.mediumSrc ?? photo.src} alt={photo.alt ?? photo.caption ?? `Family memory from ${photo.albumName}`} width={photo.width} height={photo.height} sizes={sizes} priority={priority} onError={() => setFailed(true)} />;
}
