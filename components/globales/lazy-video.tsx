"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  src: string;
  poster: string;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  /** false: el padre decide cuándo reproducir (p. ej. el clip activo de una lista). */
  autoPlayInView?: boolean;
  onEnded?: () => void;
};

// Solo descarga y reproduce cuando está en pantalla; con "reducir movimiento" se queda en el póster.
const LazyVideo = forwardRef<HTMLVideoElement, Props>(function LazyVideo(
  { src, poster, className, style, loop = true, autoPlayInView = true, onEnded },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlayInView || prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlayInView]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      playsInline
      loop={loop}
      preload="none"
      aria-hidden="true"
      onEnded={onEnded}
      className={className}
      style={style}
    />
  );
});

export default LazyVideo;
