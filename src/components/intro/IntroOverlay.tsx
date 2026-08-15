"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIntroCut } from "./useIntroCut";
import { markIntroSeen } from "./useIntroGate";

type Phase = "playing" | "fading-video" | "holding" | "fading-overlay";

const VIDEO_FADE_MS = 400;
const HOLD_MS = 200;
const OVERLAY_FADE_MS = 600;
// Both source clips run ~6s. If the video never fires onEnded — a broken
// file, exhausted <source> candidates (which fires `error` on the source,
// not the <video>, so our onError handler never sees it), or a permanent
// stall — this forces the exit sequence anyway rather than trapping
// someone on a black screen indefinitely.
const WATCHDOG_MS = 10000;

export function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const cut = useIntroCut();
  const videoRef = useRef<HTMLVideoElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const tapButtonRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Send focus into the overlay so keyboard users don't land on nav/hero
  // controls hidden underneath it.
  useEffect(() => {
    skipButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (needsTapToPlay) tapButtonRef.current?.focus();
  }, [needsTapToPlay]);

  const exit = useCallback(() => {
    markIntroSeen();
    setPhase((p) => (p === "playing" ? "fading-video" : p));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        exit();
        return;
      }
      // Trap focus: at most two buttons live in the overlay, so cycle
      // between whichever are currently rendered instead of letting Tab
      // reach the (fully covered but still tabbable) page underneath.
      // Only while actually playing — once exit has started the overlay
      // is on its way out (up to ~1.2s fade) and Tab should be free to
      // move into the page as it's revealed, not stuck on a dying overlay.
      if (e.key !== "Tab" || phase !== "playing") return;
      const focusables = [tapButtonRef.current, skipButtonRef.current].filter(
        (el): el is HTMLButtonElement => el !== null,
      );
      if (focusables.length === 0) return;
      e.preventDefault();
      const currentIndex = focusables.indexOf(document.activeElement as HTMLButtonElement);
      const nextIndex = e.shiftKey
        ? (currentIndex - 1 + focusables.length) % focusables.length
        : (currentIndex + 1) % focusables.length;
      focusables[nextIndex]?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exit, phase]);

  // Drive the exit off the video's own onEnded — the two source cuts have
  // different durations, so a hardcoded timer would desync from playback.
  // Paused while waiting on a tap-to-play tap: the clock shouldn't run
  // against a video that autoplay never actually started, or the watchdog
  // can cut off real playback that only just began.
  useEffect(() => {
    if (phase !== "playing" || needsTapToPlay) return;
    const t = setTimeout(exit, WATCHDOG_MS);
    return () => clearTimeout(t);
  }, [phase, needsTapToPlay, exit]);

  useEffect(() => {
    if (phase !== "playing") return;
    const video = videoRef.current;
    if (!video) return; // cut not resolved yet, <video> not mounted
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => setNeedsTapToPlay(true));
    }
    // re-run once `cut` resolves and the <video> element mounts
  }, [phase, cut]);

  // video -> black -> page, never video -> page directly: both source
  // clips end mid-scene on a bright frame, and a direct crossfade from
  // that would look like a glitch.
  useEffect(() => {
    if (phase !== "fading-video") return;
    const t = setTimeout(() => setPhase("holding"), VIDEO_FADE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "holding") return;
    const t = setTimeout(() => setPhase("fading-overlay"), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading-overlay") return;
    const t = setTimeout(onComplete, OVERLAY_FADE_MS);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const videoFadedOut = phase === "fading-video" || phase === "holding" || phase === "fading-overlay";
  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Intro video"
      className="fixed inset-0 z-50 bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fading-overlay" ? 0 : 1 }}
      transition={{ duration: OVERLAY_FADE_MS / 1000, ease: "linear" }}
    >
      {cut && (
        <motion.video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={cut.poster}
          onEnded={exit}
          onError={exit}
          className="h-full w-full object-cover"
          initial={{ opacity: 1 }}
          animate={{ opacity: videoFadedOut ? 0 : 1 }}
          transition={{ duration: VIDEO_FADE_MS / 1000, ease: "linear" }}
        >
          {cut.webm && <source src={cut.webm} type="video/webm" />}
          <source src={cut.mp4} type="video/mp4" />
        </motion.video>
      )}

      {needsTapToPlay && (
        <button
          ref={tapButtonRef}
          type="button"
          onClick={() => {
            videoRef.current?.play();
            setNeedsTapToPlay(false);
          }}
          className={`absolute inset-0 flex items-center justify-center type-meta text-meta text-paper ${focusRing}`}
        >
          Tap to play
        </button>
      )}

      <button
        ref={skipButtonRef}
        type="button"
        onClick={exit}
        className={`absolute bottom-6 right-6 type-meta text-meta text-acid ${focusRing}`}
      >
        Skip →
      </button>
    </motion.div>
  );
}
