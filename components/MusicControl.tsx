"use client";
import { Music, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function MusicControl({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null); const [playing, setPlaying] = useState(false); const [volume, setVolume] = useState(.55); const [failed, setFailed] = useState(false);
  useEffect(() => { const saved = sessionStorage.getItem("memory-book-volume"); if (saved) setVolume(Number(saved)); }, []);
  useEffect(() => { if (audio.current) audio.current.volume = volume; sessionStorage.setItem("memory-book-volume", String(volume)); }, [volume]);
  if (failed) return null;
  return <div className="music-control"><audio ref={audio} src={src} loop onError={() => setFailed(true)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
    <Music size={16} aria-hidden /><button onClick={() => playing ? audio.current?.pause() : audio.current?.play()} aria-label={playing ? "Pause background music" : "Play background music"}>{playing ? <Pause /> : <Play />}</button>
    <Volume2 size={16} aria-hidden /><input aria-label="Music volume" type="range" min="0" max="1" step=".05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
  </div>;
}
