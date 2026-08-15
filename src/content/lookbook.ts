export type Shot = {
  src: string;
  alt: string;
  /** second-layer image revealed by the pointer/scroll wipe — see design plan §3.4 */
  under: string;
  underAlt: string;
  caption?: string;
};

// No lookbook photography exists yet (each shot needs two images — the
// signature layer-wipe interaction has nothing to wipe between until then).
// Drop files into public/lookbook/ and add entries here.
export const lookbook: Shot[] = [];
