import MemoryBook from "@/components/MemoryBook";
import manifest from "@/src/data/photo-manifest.json";
import type { PhotoManifest } from "@/src/types/photos";

export default function Home() { return <MemoryBook manifest={manifest as PhotoManifest} />; }
