export type BtsEntry = {
  src: string;
  type: "image" | "video";
  alt: string;
  caption?: string;
  date: string; // ISO date
};

export const bts: BtsEntry[] = [];
