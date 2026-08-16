"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

// The shop grid's cover shots rock side to side to invite a click, same
// motion ProductDetail used to use pre-click — see the "still once open"
// note there for why it stops once you're on the product page.
export function SwingingImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={reducedMotion ? undefined : { rotate: [-3, 3, -3] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative aspect-[3/4] w-full bg-paper/5"
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </motion.div>
  );
}
