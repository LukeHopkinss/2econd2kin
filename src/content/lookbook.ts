export type Shot = {
  src: string;
  alt: string;
};

// Issue 01: Party Like It's 1999 — shot on location in Soho, NYC.
// Single images, not before/after pairs, so these render as a plain
// editorial grid (src/app/lookbook/page.tsx) rather than through
// LayerWipe — that component stays available for Shop's product
// galleries, which do have real before/after-style pairs to wipe between.
export const lookbook: Shot[] = [
  { src: "/lookbook/01.jpg", alt: "FaurY standing against a plain doorway in a 2econd2kin Magazine tee" },
  { src: "/lookbook/02.jpg", alt: "Two models in 2econd2kin Magazine tees posed in a brownstone doorway" },
  { src: "/lookbook/03.jpg", alt: "Model seated on brownstone steps, looking down" },
  { src: "/lookbook/04.jpg", alt: "FaurY standing against a graffiti-covered brick wall" },
  { src: "/lookbook/05.jpg", alt: "Cropped shot of a 2econd2kin Magazine tee and denim on a city street" },
  { src: "/lookbook/06.jpg", alt: "FaurY walking past a row of Citi Bikes on a Soho street" },
  { src: "/lookbook/07.jpg", alt: "Model seated on brownstone steps, hand in hair, smiling" },
  { src: "/lookbook/08.jpg", alt: "FaurY climbing a fire escape ladder against a graffiti wall" },
  { src: "/lookbook/09.jpg", alt: "FaurY throwing a peace sign beside a subway station sign" },
  { src: "/lookbook/10.jpg", alt: "Model seated on brownstone steps, hand resting on head" },
  { src: "/lookbook/11.jpg", alt: "Low-angle shot of FaurY against a building facade" },
  { src: "/lookbook/12.jpg", alt: "Close-up detail shot of stickers on a Soho street pole" },
  { src: "/lookbook/13.jpg", alt: "FaurY seated on brownstone steps, flexing" },
  { src: "/lookbook/14.jpg", alt: "Two models in a brownstone doorway, alternate angle" },
  { src: "/lookbook/15.jpg", alt: "FaurY reaching up to a pedestrian crossing signal" },
  { src: "/lookbook/16.jpg", alt: "Model reaching up to a street sign, back to camera" },
  { src: "/lookbook/17.jpg", alt: "Close-up of FaurY's arm and bracelets against a doorway" },
  { src: "/lookbook/18.jpg", alt: "FaurY and a model crouched together over a camera" },
  { src: "/lookbook/19.jpg", alt: "Model on a phone call on a Soho sidewalk" },
  { src: "/lookbook/20.jpg", alt: "FaurY on a phone call, seated in an alley" },
  { src: "/lookbook/21.jpg", alt: "Close-up of FaurY in shadow against a doorway" },
  { src: "/lookbook/22.jpg", alt: "FaurY and a model crouched together over a camera, close angle" },
  { src: "/lookbook/23.jpg", alt: "FaurY standing mid-street holding a bag" },
  { src: "/lookbook/24.jpg", alt: "FaurY and a model at a subway platform, heads down" },
  { src: "/lookbook/25.jpg", alt: "FaurY seated in a dimly lit alley" },
  { src: "/lookbook/26.jpg", alt: "FaurY beside a subway station sign, close angle" },
];
