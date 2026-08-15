"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Shared scroll-reveal primitive — animates in once when it enters the
// viewport. Motion's default is reducedMotion: "never" — it does NOT
// honor prefers-reduced-motion on its own, unlike CSS transitions (which
// the global rule in globals.css already neutralizes). useReducedMotion()
// is Motion's own hook for this; when it resolves true, this renders a
// plain always-visible div with no scroll-linked animation at all.
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
