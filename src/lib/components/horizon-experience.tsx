"use client";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";
import { createOceanRenderer } from "@/lib/ocean-renderer";
// User-supplied Kling clip, cropped and encoded locally with every frame seekable.
export const film: { desktop: string | null; mobile: string | null } = {
  desktop: "/media/horizon-scroll-desktop.mp4",
  mobile: "/media/horizon-scroll-mobile.mp4",
};
export default function HorizonExperience() {
  const section = useRef<HTMLElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  // null until the viewport is known, so phones never start downloading the desktop film.
  const [mobileFilm, setMobileFilm] = useState<boolean | null>(null);
  const [filmReady, setFilmReady] = useState(false);
  const [filmFailed, setFilmFailed] = useState(false);
  useEffect(() => {
    const mobile = matchMedia("(max-width: 640px)");
    const updateSource = () => setMobileFilm(mobile.matches);
    updateSource();
    mobile.addEventListener("change", updateSource);
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!m.matches);
    update();
    m.addEventListener("change", update);
    return () => {
      m.removeEventListener("change", update);
      mobile.removeEventListener("change", updateSource);
    };
  }, []);
  useEffect(() => {
    const root = section.current,
      c = canvas.current;
    if (
      !root ||
      !c ||
      !motionAllowed ||
      paused ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0,
      visible = true,
      progress = Number(root.style.getPropertyValue("--progress")) || 0,
      target = 0,
      last = 0,
      alive = true;
    const poster = root.querySelector<HTMLImageElement>(".hero-image img");
    // Avoid running a hidden WebGL renderer underneath a decoded film.
    const ocean = poster && filmFailed ? createOceanRenderer(c, poster) : null;
    let pointerX = 0,
      pointerY = 0,
      smoothX = 0,
      smoothY = 0;
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = (event.clientX / innerWidth - 0.5) * 2;
      pointerY = (event.clientY / innerHeight - 0.5) * 2;
    };
    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
    };
    root.addEventListener("pointermove", pointer, { passive: true });
    root.addEventListener("pointerleave", resetPointer);
    const measure = () => {
      const rect = root.getBoundingClientRect();
      target = Math.min(
        1,
        Math.max(0, -rect.top / (root.offsetHeight - innerHeight)),
      );
    };
    const resize = () => {
      ocean?.resize();
      measure();
    };
    const seek = () => {
      const v = video.current;
      if (
        v &&
        !v.seeking &&
        v.readyState >= HTMLMediaElement.HAVE_METADATA &&
        Number.isFinite(v.duration)
      ) {
        // The asset is 24fps, all-I. Quantize to source frames for exact reverse seeks.
        const lastFrame = Math.max(0, Math.round(v.duration * 24) - 1);
        const desired = Math.round(progress * lastFrame) / 24;
        if (Math.abs(v.currentTime - desired) > 1 / 48) v.currentTime = desired;
      }
    };
    const draw = (now: number) => {
      if (!alive || !visible || document.hidden) {
        frame = 0;
        return;
      }
      const dt = Math.min(50, now - (last || now));
      last = now;
      progress += (target - progress) * (1 - Math.exp(-dt / 90));
      if (
        Math.abs(Number(root.style.getPropertyValue("--progress")) - progress) >
          0.0001 ||
        !root.style.getPropertyValue("--progress")
      )
        root.style.setProperty("--progress", String(progress));
      seek();
      smoothX += (pointerX - smoothX) * 0.035;
      smoothY += (pointerY - smoothY) * 0.035;
      ocean?.draw(now / 1000, smoothX, smoothY);
      frame = requestAnimationFrame(draw);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0 },
    );
    observer.observe(root);
    root.classList.add("motion-active");
    resize();
    start();
    addEventListener("scroll", measure, { passive: true });
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", measure);
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointermove", pointer);
      root.removeEventListener("pointerleave", resetPointer);
      ocean?.destroy();
    };
  }, [paused, motionAllowed, filmFailed]);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // iOS Safari ignores preload and never decodes a frame for a video that has
    // not played, so loadeddata never fires. A muted play/pause primes the decoder;
    // Low Power Mode rejects autoplay, so retry on the first touch.
    let primed = false;
    const prime = () => {
      if (primed) return;
      v.play()
        .then(() => {
          primed = true;
          v.pause();
          setFilmReady(true);
          removeEventListener("touchstart", prime);
        })
        .catch(() => {});
    };
    prime();
    addEventListener("touchstart", prime, { passive: true });
    return () => removeEventListener("touchstart", prime);
  }, [mobileFilm, motionAllowed, filmFailed]);
  return (
    <section
      ref={section}
      className="horizon-experience"
      aria-label="A clearer financial horizon"
    >
      <div className="hero-sticky">
        <div className="hero-image">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="/media/horizon-film-mobile.webp"
            />
            <img
              src="/media/horizon-film-poster.webp"
              alt="A quiet coastal horizon at dawn"
              fetchPriority="high"
              width="1760"
              height="990"
            />
          </picture>
          <canvas ref={canvas} className="horizon-canvas" aria-hidden="true" />
          {film.desktop && mobileFilm !== null && motionAllowed && !filmFailed && (
            <video
              ref={video}
              className={`hero-video${filmReady ? " is-ready" : ""}`}
              muted
              playsInline
              preload="auto"
              src={(mobileFilm ? film.mobile : film.desktop) || film.desktop}
              onLoadStart={() => setFilmReady(false)}
              onLoadedData={() => setFilmReady(true)}
              onSeeked={() => setFilmReady(true)}
              onError={() => {
                setFilmReady(false);
                setFilmFailed(true);
              }}
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
            ></video>
          )}
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow light">
            <span className="small-line" />
            YOUR BUSINESS. A CLEARER HORIZON.
          </div>
          <h1>
            Less worry.
            <br />
            More possibility.
          </h1>
          <p>
            Clear books. Confident decisions. More room to grow.
            <br className="desktop-break" /> Bookkeeping and financial guidance
            that move you forward.
          </p>
          <a className="button button-light" href="#contact">
            Let’s find your clarity <Arrow diagonal />
          </a>
          <div className="hero-location">
            <span className="location-dot" />
            Based in Jacksonville. Here for your business.
          </div>
        </div>
        <div className="hero-second" aria-hidden="true">
          <span className="eyebrow light">ROOM TO SEE WHAT’S NEXT</span>
          <p>
            Your ambition.
            <br />A clearer perspective.
          </p>
        </div>
        <div className="hero-bottom">
          <a href="#services" className="scroll-cue">
            <span className="scroll-arrow">↓</span> A clearer path starts here
          </a>
          <span className="hero-caption">
            BUILT AROUND YOUR BUSINESS. AND YOUR LIFE.
          </span>
          <button
            type="button"
            className="motion-toggle"
            onClick={() => setPaused(!paused)}
            aria-pressed={paused}
            aria-label={paused ? "Enable motion" : "Pause motion"}
          >
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
            <span>{paused ? "Motion off" : "Pause motion"}</span>
          </button>
        </div>
        <div className="scroll-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
