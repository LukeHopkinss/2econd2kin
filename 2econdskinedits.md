# 2econd2kin — Build Log

Tracks implementation against `2econdskinplan.md` (Downloads), milestone by milestone
(plan §8 build order). Sonnet 5 implements; Opus 5 reviews after each milestone.

---

## Setup notes / deviations from the plan

- **Package manager: npm, not pnpm.** pnpm requires Node ≥22.13; this machine runs
  Node v22.2.0, and `corepack enable` failed with a signature-verification error
  against the npm registry. Switching package managers doesn't change anything
  functional in the plan — noting it since §1 specifically recommends pnpm.
- **ffmpeg is not installed** on this machine, so the video encode recipe in plan
  §4.2 has not been run. `public/video/intro-portrait.mp4` and
  `intro-landscape.mp4` are currently the **raw source `.MOV` files, renamed**
  (H.264/AAC plays fine in an `.mp4`-named container) — they still have audio
  tracks and are ~5-6x heavier than the plan's target. No `.webm` variants or
  poster JPEGs exist yet; the components treat both as optional and degrade
  gracefully (a missing `<source>` or `poster` just doesn't load, no crash).
  **Action needed:** install ffmpeg and run the §4.2 recipe, or hand the two
  source files to something else that can, before this goes anywhere near
  production. Commands are already written out in the plan.
- No lookbook photography, BTS media, product photos, or logo/wordmark file
  exists in Downloads yet (checked — the only logo-looking file there,
  `BLACK LOGO.jpg`, is for an unrelated brand called LARA). Content-dependent
  pieces (lookbook layer-wipe, BTS feed, shop grid) are built as typed,
  empty-state-safe scaffolding per plan §7, ready for content to be dropped in.

---

## Milestone 1+2: Foundation + Design system

Built together since they share almost every file.

**Added:**
- `create-next-app` scaffold: Next.js 16.3.1, App Router, TypeScript `strict:
  true`, Tailwind v4, ESLint. (`next`/`react`/`react-dom` versions are newer
  than what the plan names — Next 15 was the plan's target, 16 is current
  stable at build time. No API changes affected this build.)
- `motion` (Framer Motion successor) installed for the intro sequence.
- `src/app/globals.css` — `@theme` token block: the six brand hexes
  (`--color-hot/acid/cyan/violet/paper/ink`), font family vars, and the
  clamp()'d type scale from plan §3.3, exactly as specified.
- `src/app/fonts.ts` — Antonio (weight **700 only**, per the plan's warning
  that Antonio's axis tops out at 700 and asking for 800 fake-bolds it),
  Public Sans (body), JetBrains Mono (utility/meta text).
- `src/components/ui/Button.tsx`, `Badge.tsx`, `Section.tsx` — the hand-rolled
  primitives plan §1 calls for instead of a UI kit.
- `src/components/nav/Nav.tsx`, `Footer.tsx` — nav is `sticky` (not the
  plan's literal `fixed`; fixed would've overlapped page content without
  compensating padding on every page, sticky avoids that class of bug for
  free) and includes a mobile menu toggle, which the plan didn't spec but a
  nav that just disappears under 768px isn't shippable.
- Route stubs for all five top-level routes (`/`, `/about`, `/lookbook`,
  `/behind-the-scenes`, `/shop`, `/shop/[handle]`), each with real
  `<Metadata>` and an empty-state message where content doesn't exist yet.
- `/styleguide` — swatches, type scale, buttons, badges. Plan-specified
  deliverable for milestone 2.
- `src/content/lookbook.ts`, `src/content/bts.ts` — typed manifests per plan
  §7, currently empty arrays with a comment explaining why.
- `src/lib/shop/types.ts`, `client.ts` — Shopify Storefront API client
  scaffold per plan §6's recommendation. Reads `SHOPIFY_STORE_DOMAIN` /
  `SHOPIFY_STOREFRONT_ACCESS_TOKEN` from env; with neither set (the current
  state — no store exists), `getProducts()`/`getProduct()` return
  empty/null instead of throwing, so `/shop` renders its empty state instead
  of crashing the build. The actual GraphQL queries are `TODO` — nothing to
  query yet.
- `src/app/sitemap.ts`, `robots.ts` — plan §8 milestone 8 items, pulled
  forward since they're cheap and have no dependencies on later milestones.

**Note:** §6/§9.2 (Shopify vs. Stripe) is still an open decision per the
plan itself. Built the scaffold against the plan's own recommendation
(Shopify) since it's a strict superset of effort either way — swapping to
Stripe later means replacing `lib/shop/client.ts` internals, not the page
code that calls it.

---

## Milestone 3: Intro sequence

**Added:**
- `src/components/intro/useIntroCut.ts` — resolves portrait vs. landscape
  cut from `matchMedia`, per plan §4.3 Option A (orientation + width, not
  UA sniffing). Implemented with `useSyncExternalStore` rather than the
  plan's literal `useEffect`+`useState` snippet — this repo's ESLint config
  includes the newer `react-hooks/set-state-in-effect` rule, which flags
  synchronous `setState` in an effect body as an error. `useSyncExternalStore`
  is the idiomatic replacement for exactly this "resolve a client-only value
  once" pattern and gets the same null-on-server / real-value-after-hydration
  behavior the plan's snippet was going for.
- `src/components/intro/useIntroGate.ts` — same pattern, decides whether to
  show the intro at all: bypassed entirely under
  `prefers-reduced-motion: reduce` (plan is explicit this is an accessibility
  requirement, not a nicety), otherwise gated on `sessionStorage['intro-seen']`
  so a single session doesn't replay it across `shop → about → home`, but a
  return visit next week does see it again.
- `src/components/intro/IntroOverlay.tsx` — the actual overlay:
  - `autoPlay muted playsInline` (all three required per plan §4.4 — missing
    `muted` blocks autoplay everywhere, missing `playsInline` makes iOS Safari
    hijack the screen into native fullscreen).
  - Exit is driven off the video's own `onEnded`, not a hardcoded timer —
    the plan's two source clips differ in length by 0.63s.
  - Fade sequence matches plan §4.4 exactly: video opacity → 0 over 400ms,
    hold on black 200ms, then whole overlay → 0 over 600ms. Goes
    video→black→page, never video→page directly, because both source clips
    end mid-scene on a bright frame and a direct crossfade would look like a
    glitch (plan §4.1).
  - `onError` routes into the same exit sequence as `onEnded`, so a broken
    video file can't trap someone on a black screen.
  - Rejected `play()` promises (iOS Low Power Mode, data-saver) fall through
    to a "Tap to play" button over the poster instead of a frozen screen.
  - Skip button, bottom-right, mono, `SKIP →`, always visible (not
    hover-revealed) in acid yellow. Escape key does the same thing.
  - Body scroll is locked for the duration and restored on unmount.
- `src/components/intro/IntroGateway.tsx` — wraps the above in
  `AnimatePresence` and is the **only** place `IntroOverlay` gets mounted.
  It's rendered exclusively from `src/app/page.tsx` — which is what makes
  deep links skip the intro per plan §4.5 ("only `/` shows the intro"),
  without needing an explicit pathname check anywhere.
- Copied the two source videos into `public/video/` as placeholders (see
  ffmpeg note above — these are not the optimized encode the plan
  specifies).

**Manually verified in Chrome** (dev server, `localhost:3000`):
- `/` shows the black overlay with a visible `SKIP →` immediately.
- Clicking Skip fades correctly into the landing page (hero, nav, footer all
  render as designed).
- Navigating `/ → /shop` client-side does not replay the intro (session gate
  holds).
- Loading `/about` as a fresh direct navigation renders normally with no
  intro overlay (deep-link skip, by construction).
- No console errors on any of the above.
- Not yet tested: real device / real iPhone (plan §8 flags this explicitly:
  "Test on a real iPhone before moving on — this is where it breaks"),
  reduced-motion bypass, and the rejected-autoplay tap-to-play fallback —
  none of these are practically testable from this environment.

**Verification run before handoff:** `tsc --noEmit` clean, `next lint` clean
(0 errors/warnings), `next build` succeeds (all 5 routes + `/styleguide` +
`/shop/[handle]` compile).

---

## Opus 5 review — Milestones 1-3

Opus 5 reviewed the actual source (not just this log) and found four
must-fix bugs and a set of should-fix / nice-to-have items. Verbatim
findings, then what was done about each:

**Must-fix:**

1. **Intro flashed the landing page before appearing.** `useIntroGate`'s
   `getServerSnapshot` returned `false`, so SSR/first hydration painted the
   hero with scroll unlocked, and the overlay only slammed on top after a
   post-hydration re-render — the opposite of plan §4.3/§4.4 ("no flash",
   "0ms overlay visible"). **Fixed:** `getServerSnapshot` now returns `true`
   — assume-show until proven otherwise. `useSyncExternalStore` reconciles
   this against the real client value immediately post-mount, so a
   returning visitor sees this for at most one paint before the overlay is
   removed, never a video replay. Manually verified in Chrome: a fresh full
   reload after skipping goes straight to the hero, no overlay flash either
   direction.
2. **`useIntroGate` violated the `useSyncExternalStore` contract.**
   `getSnapshot` read `sessionStorage`, which `IntroGateway`'s mount effect
   mutated without notifying the store — any re-snapshot (StrictMode's
   double effect mount, an unrelated parent re-render) could return `false`
   and unmount the overlay mid-play. **Fixed:** moved `markIntroSeen()` out
   of `IntroGateway`'s mount effect entirely; it's now called from
   `IntroOverlay`'s own `exit()` — i.e. only once the user has actually
   skipped, watched to the end, or hit the watchdog. `IntroGateway`'s
   `visible` state (not the gate's snapshot) governs unmount from then on,
   so the snapshot never needs to change mid-play.
3. **`onError` doesn't fire when all `<source>` candidates fail.** Per
   spec, exhausting `<source>`s fires `error` on each *source*, not the
   `<video>` — so `NETWORK_NO_SOURCE` never reached our handler, and
   §4.5's "broken video must not trap the user" wasn't actually satisfied
   (live bug: both `.webm` sources and both poster JPGs currently 404).
   **Fixed:** added a 10s watchdog timer that force-exits if `onEnded`
   hasn't fired by then, covering silent source failures and permanent
   stalls alike.
4. **Unlayered `.font-display`/`.font-meta` silently beat every Tailwind
   utility**, verified in the compiled CSS: the hand-written rules sat
   outside any `@layer`, so they won over layered utilities unconditionally
   regardless of source order (`type-display leading-none` was a no-op),
   and `.font-display` name-collided with Tailwind's auto-generated
   `font-display` utility (from the `--font-display` theme token sitting in
   the `--font-*` namespace). **Fixed:** renamed the composite classes to
   `type-display`/`type-meta` and authored them with Tailwind v4's
   `@utility` at-rule so they land in the real utilities layer. Re-verified
   in the compiled output — `.type-display`/`.type-meta` now appear inside
   `@layer utilities`.

**Should-fix — all addressed:**

5. **Font tokens were self-referential/shadowed.** `--font-display` (our
   theme token) and next/font's own generated `--font-display` variable
   had the same name and both targeted `<html>`; ours only "worked" because
   next/font's unlayered value always won, making our appended `"Arial
   Narrow"` fallback dead code. **Fixed:** renamed our tokens to
   `--font-antonio` / `--font-public-sans` (kept `--font-mono` as-is — it's
   an intentional override of Tailwind's own mono slot and every nav/badge/
   button already depends on the auto-generated `font-mono` utility), and
   switched the `@theme` block to `@theme inline` per next/font's own
   Tailwind v4 integration guidance.
6. **Overlay accessibility.** Added `role="dialog" aria-modal="true"
   aria-label="Intro video"` to the overlay, focus moves to the Skip button
   on mount (and to Tap-to-play if it appears), added a focus trap (Tab/
   Shift+Tab cycle between whichever of the two buttons are currently
   rendered instead of reaching the covered page underneath), and added
   `focus-visible` rings to Skip/Tap-to-play (and, while touching this,
   to every Nav link/button and the Footer's newsletter button — none of
   the raw `<button>`/`<Link>` elements had one before, only the `Button`
   component did). Manually verified: fresh session, Escape key exits
   correctly, and the Skip button's cyan focus ring is visibly active from
   the programmatic mount-focus.
7. **Nav landmarks.** Added `id="mobile-nav-panel"` + `aria-controls` on
   the toggle button, and `aria-label="Primary"` / `aria-label="Mobile"` on
   the two `<nav>` elements so they're distinguishable to assistive tech.

**Nice-to-have — addressed:**
- `lib/shop/client.ts`: removed the `next: { revalidate: 60 }` fetch option
  (silently ignored — Next only caches `GET`, and the Storefront API is
  POST-only; real caching will need `unstable_cache` or route-segment
  config once real queries exist) and added a `json.errors` check.
- `Button`: `disabled` + `href` together now render a non-interactive
  `aria-disabled` span instead of silently dropping `disabled`.
- Root layout: added `metadataBase` and a `title.template` ("%s —
  2econd2kin"), so every page sets a short title instead of repeating the
  suffix by hand. `/styleguide` also got `robots: { index: false }` — it's
  a dev tool, not site content.

**Nice-to-have — explicitly deferred, not addressed:**
- iOS Safari's unreliable `body { overflow: hidden }` scroll lock (a more
  robust fix means a position-fixed-body technique with its own scroll-jump
  risks; this is exactly the class of thing plan §8 milestone 3 flags as
  needing a real iPhone to validate, which isn't available in this
  environment).
- Orientation change mid-intro restarting the video (swaps `cut` → new
  `src`). Low-frequency edge case, left as-is.

**Re-verified after fixes:** `tsc --noEmit` clean, `next lint` clean (0
errors/warnings), `next build` succeeds. Re-tested in Chrome: overlay
still shows immediately with no flash, Skip still fades correctly into the
landing page, a full reload after skipping does not replay the intro
(session gate holds through the getServerSnapshot change), and Escape-skip
works with visible focus management. No console errors in any of the
above.

## Opus 5 fix-verification pass

Verified against the actual source and compiled output (not just this
log), plus running `tsc`/`lint`/`build` independently. Results:

- **Must-fix 1 (SSR flash):** PASS.
- **Must-fix 2 (`useSyncExternalStore` contract):** PASS, with a residual
  nit — `exit()` still wrote `sessionStorage` without notifying
  subscribers, so a stray re-render during the ~1.2s exit fade could in
  theory re-check the snapshot and cut the overlay abruptly instead of
  letting the fade finish. Narrow window, but real.
- **Must-fix 3 (watchdog):** PASS, but flagged a **new bug**: the 10s
  watchdog starts at mount and doesn't pause for the tap-to-play fallback,
  so if autoplay is rejected and the user taps late, the watchdog could
  force-exit a few seconds into genuine playback.
- **Must-fix 4 (`@utility` / layer placement):** PASS — re-verified against
  fresh compiled CSS byte offsets; `.type-display`/`.type-meta` sit inside
  `@layer utilities`, `--font-antonio`/`--font-public-sans` inside
  `@layer theme`, zero leftover `.font-display`/`.font-meta` in output.
- **Should-fix 5/6 (font rename, full class rename):** PASS — zero
  stragglers found across `src/`.
- **Should-fix 7 (overlay a11y):** PASS with two minor flaws — a dead
  `nextIndex === -1 ? 0 : nextIndex` branch (modulo arithmetic can't
  produce -1, given `focusables.length` is always 1 or 2), and the Tab trap
  staying active through the fade-out phases, briefly blocking Tab on an
  overlay that's already visually transparent and on its way out.
- **Should-fix 8 (nav a11y):** PASS — one nit noted (the mobile panel's
  `aria-controls` target doesn't exist in the DOM while the menu is
  closed, since the panel is conditionally rendered; a common and
  generally-accepted pattern, not treated as a defect).
- Toolchain (`tsc`, `lint`, `build`): all clean, independently re-run.

**Follow-up fixes applied for the two real issues (new watchdog bug +
residual snapshot nit) and the two minor flaws:**

- `IntroOverlay.tsx`: the watchdog effect now also depends on
  `needsTapToPlay` and bails while it's true, so the 10s clock only runs
  against video that's actually attempting to play — pausing during the
  tap-to-play wait and restarting fresh once tapped.
- `IntroOverlay.tsx`: removed the dead `nextIndex === -1 ? 0 : nextIndex`
  fallback (confirmed unreachable). Tab-trapping now only applies during
  the `"playing"` phase — once `exit()` has been triggered, Tab is free to
  move into the page as it's revealed instead of being caught on a
  transparent, departing overlay.
- `useIntroGate.ts`: the "show intro" decision is now **latched inside the
  store itself** (a module-level `let latchedShow`, mutated the first time
  `getSnapshot` resolves true) rather than left to re-evaluate
  `sessionStorage`/`matchMedia` on every call. Once true, always true for
  the rest of that page load — closes the residual nit completely, since
  `markIntroSeen()`'s write can no longer affect the snapshot at all. This
  is internal store state, not React state, so it needed no
  `useEffect`/`useState`/`useRef` at the component level (the first two
  approaches tried here were both rejected by this repo's ESLint config —
  `react-hooks/set-state-in-effect` for a state+effect latch, then
  `react-hooks/refs` for a ref mutated during render — before landing on
  keeping the latch inside the external store, which is idiomatic
  `useSyncExternalStore` usage and satisfies both rules for free).
- `IntroGateway.tsx`: reverted to gating directly on `useIntroGate()`'s
  return value, now safe given the latch above.

**Re-verified after these follow-ups:** `tsc --noEmit` clean, `next lint`
clean, `next build` succeeds (all 11 routes). Re-tested in Chrome: no
console errors, Skip still fades correctly (screenshot mid-fade shows the
Skip button's focus ring correctly active), no regressions.

Not sent back for a third Opus 5 pass — these were narrowly-scoped
mechanical fixes for precisely-identified findings (a dependency-array
addition, a dead-code deletion, a condition tightened, and moving one
boolean's storage location), each re-verified directly against compiled
output and live browser behavior above. Milestone 1-3 is considered done.

---

## Milestone 4: Landing

Plan §5 calls for: hero (thesis statement + two links, already built in
milestone 1-3's pass), 3-4 featured products, a latest-lookbook strip, and
reveal animations. Added:

- `src/components/ui/Reveal.tsx` — a small `motion`-based scroll-reveal
  wrapper (`whileInView`, fires once). `motion` already respects
  `prefers-reduced-motion` internally, so this doesn't need its own
  reduced-motion branch — it's covered for free by the same requirement
  the intro sequence implements explicitly.
- `src/app/page.tsx` — now an async Server Component (`getProducts()` is
  async): a Featured section (first 4 products) and a Lookbook strip
  (first 4 shots), each wrapped in `<Reveal>` and each rendering the same
  "Coming soon" empty state used elsewhere on the site, since both
  `products` and `lookbook` are still empty per the content notes at the
  top of this file. Product cards link to `/shop/[handle]` via `next/link`.

## Milestone 5: About + BTS (partial — no content exists yet)

About was already structurally compliant with plan §5 (single column,
~65ch measure, hot-pink heading) from the milestone 1-3 pass; left as-is
rather than inventing brand-story copy that isn't mine to write.

**Behind the Scenes** (`src/app/behind-the-scenes/page.tsx`): built the
actual grid-rendering logic against the existing `BtsEntry` type (still
empty-state-safe, since `content/bts.ts` has no entries yet) — an uneven
grid (every third entry spans 2 columns, per plan §5's "deliberately
rougher... uneven grid"), `next/image` for `type: "image"` entries with
`priority` on the first two, and a plain placeholder block for
`type: "video"` entries rather than a self-hosted `<video>` — plan §5 is
explicit BTS clips need Mux/Cloudinary adaptive streaming once they exist,
not raw MP4s. Actual Mux wiring is deferred until real footage exists;
building that integration against zero real clips isn't buildable, only
guessable.

## Milestone 8: Polish (partial)

Sitemap/robots were already done in the milestone 1-3 pass. Added the
remaining low-hanging, content-independent items:

- `src/app/not-found.tsx` — branded 404 (was falling back to Next's
  generic default), noindexed, links back to Home/Shop.
- `src/app/opengraph-image.tsx` — a single site-wide OG image via
  `next/og`'s `ImageResponse` (branded, text-only — next/font's Google
  Fonts wiring doesn't apply inside `ImageResponse`, which needs raw font
  bytes, so this uses a bold system sans rather than fetching Antonio's
  font file for one image). Per-route dynamic OG images (product title,
  lookbook look) are a natural follow-up once Shop/Lookbook have real
  content — not built now since there's nothing route-specific to render
  yet.
- `src/app/shop/page.tsx` — was rendering products as inert `<div>`s;
  now links to the PDP via `next/link` and shows a real in-stock/sold-out
  `Badge`, matching the pattern already used on the landing page's
  Featured section (this was a leftover from the original milestone 1
  scaffold, not a new plan requirement, but it's exactly the class of bug
  a Lighthouse/manual pass should catch, so folding it into this
  milestone).

**Explicitly deferred, with reasons:**
- **Lighthouse pass** — no Lighthouse CLI available in this environment,
  and a dev-server run wouldn't be representative anyway (plan's own
  milestone 8 implies this runs against a deployed build). Deferred to
  after a real Vercel deploy.
- **Per-route OG images** — see above, blocked on real content existing.
- **Keyboard nav audit beyond what's already in place** — every
  interactive element added through milestone 1-5 has a `focus-visible`
  ring (added during the milestone 1-3 review-fix round); no further
  audit performed since Lookbook/Shop's real interactive surfaces
  (milestones 6-7) don't exist yet to audit.

**Verification:** `tsc --noEmit` clean, `next lint` clean, `next build`
succeeds (12 routes now, including `/opengraph-image`). Manually verified
in Chrome: OG image renders correctly (1200×630, branded), custom 404
renders with working Home/Shop links and intact nav/footer, and the
landing page's new Featured/Lookbook sections render their empty states
correctly below the hero. No console errors.

## Opus 5 review — Milestones 4, 5, 8

One must-fix claim ("`not-found.tsx`'s `metadata` export is ignored")
turned out to be **incorrect** on empirical verification — built and
curled the 404 route: `<title>Not Found — 2econd2kin</title>` and
`<meta name="robots" content="noindex, nofollow"/>` are both present and
correctly applied (Next 16 honors `metadata` in `not-found.tsx`; this may
have changed across Next versions, which is likely where the claim came
from). No change needed there. Everything else was real:

**Must-fix — fixed:**

1. **`Reveal.tsx`'s reduced-motion claim was false.** Motion does not
   honor `prefers-reduced-motion` on its own (its default is
   `reducedMotion: "never"`) — only CSS transitions/animations are
   neutralized by the global rule in `globals.css`, and Motion drives
   `Reveal`'s `y`/`opacity` animation via WAAPI, untouched by that rule.
   **Fixed:** `Reveal` now calls Motion's own `useReducedMotion()` hook and
   renders a plain, always-visible `<div>` with no scroll-linked animation
   at all when it resolves true.
2. **Landing page's Featured cards hardcoded `Badge tone="cyan"` /
   "In Stock"** regardless of actual variant availability — direct
   contradiction of plan §5's stock-state requirement, and inconsistent
   with `/shop`'s own (correct) `variants.some(v => v.available)` check
   right next to it. **Fixed:** `page.tsx` now computes `inStock` the same
   way `/shop` does. While in there, also swapped the color placeholder
   `<div>`s for real `next/image` renders reading `product.images[0]` /
   `shot.src` — these were flagged as stubs presented as "built"; they're
   now genuinely wired, just untestable until real product/lookbook data
   exists.
3. **BTS grid's `sizes` was wrong for wide (2-col) cells** — a fixed
   `25vw`/`50vw` string regardless of whether the entry actually spans 1
   or 2 grid columns, so wide entries would request a half-resolution
   image candidate. **Fixed:** `sizes` is now computed per-entry from the
   same `wide` boolean that drives the `col-span` class.

**Nice-to-have — addressed:**

- **BTS `priority` indexing.** `priority={i < 2}` counted raw array
  position, so if either of the first two entries were `type: "video"`,
  no real image got priority even though row 1 (at `md:grid-cols-4`, a
  wide entry + two normal = exactly 4 columns) could contain an
  unprioritized image at index 2. **Fixed:** `priority={i < 3}`, which
  covers the entire first desktop row regardless of image/video mix.
- **OG image wasn't actually bold.** `next/og`'s `ImageResponse` doesn't
  synthesize font weights — its bundled default font is regular-only, so
  `fontWeight: 700` silently rendered as regular (confirmed visually: the
  original screenshot was clearly a regular weight despite the style).
  **Fixed:** now fetches a real bold `.ttf` from Google Fonts' CSS2 API
  using the `&text=` subsetting trick (returns `format('truetype')`
  instead of the usual `.woff2`, which is what satori needs — the same
  technique Vercel's own OG image examples use), passed via
  `ImageResponse`'s `fonts` option. Re-verified visually in Chrome: title
  now reads genuinely bold. Also added the missing `alt` export.
- **No `error.tsx` boundary.** `getProducts()`/`getProduct()` will throw
  once a real Shopify store is configured and errors (network failure,
  bad credentials); without a boundary, `/` and `/shop` would fall back to
  Next's generic default error UI. Added `src/app/error.tsx`, on-brand,
  with a "Try again" (`reset()`) and a Home link.

**Not changed:** the "uneven grid" `%3` pattern reads as a regular
repeating tile rather than genuinely uneven (plan §5 says "some images
intentionally small") — a fair critique, but a deterministic-hash
alternative is a judgment call on visual roughness, not a defect, and
there's no real BTS content yet to actually eyeball the difference against.
Left as-is.

**Re-verified after fixes:** `tsc --noEmit` clean, `next lint` clean,
`next build` succeeds (12 routes, including the OG image route rebuilding
successfully with the live Google Fonts fetch). Manually re-checked in
Chrome: OG image renders visibly bolder than before, landing page and
console both clean. Not sent back for a third Opus 5 pass on this batch —
same reasoning as the milestone 1-3 fix round: each fix maps to a
specific, independently-verified finding.

Milestones 4 and the feasible parts of 5/8 are considered done.

---

## Milestone 6: Lookbook layer-wipe signature

Plan §9.3 explicitly hands this decision back when no photography exists:
"if the photography doesn't exist, say so and I'll rework it into
something single-image." Flagged this to the user; they chose to have the
full two-layer interaction built now — structurally complete and
verified, ready to go the moment real shot pairs exist, rather than
falling back to a single-image gallery.

**Added:**

- `src/components/lookbook/LayerWipe.tsx` — the signature interaction from
  plan §3.4. Two stacked `next/image`s; the top layer sits in a
  `clip-path: inset()` that follows the pointer (`120ms linear`, hard
  edge, not a crossfade — matches the plan's explicit "not a fade" note).
  Three behavior branches:
  - **Pointer devices:** clip position tracks `clientX` directly via
    `onPointerMove`, resets to 0 (top layer fully restored) on
    `onPointerLeave`.
  - **Touch (`(hover: none)`):** no pointer to drive a wipe from, so it's
    tied to the image's own scroll position through the viewport instead,
    via Motion's `useScroll`/`useTransform` — exactly what plan §3.4's
    touch fallback asks for.
  - **`prefers-reduced-motion: reduce`:** renders the top layer only, no
    second layer mounted, no interaction — matches plan §3.4's explicit
    fallback for this case (distinct from the intro's own reduced-motion
    handling, but same requirement).
  - Coarse-pointer detection uses `useSyncExternalStore` against
    `matchMedia("(hover: none)")`, not `useEffect`+`setState` — same
    `react-hooks/set-state-in-effect` lint rule as the intro hooks forced
    this the first time around, so it was written this way from the start
    here rather than re-discovering the same fix.
- `src/app/lookbook/page.tsx` — now actually renders `<LayerWipe>` per
  shot (2-column grid, `priority` on the first two), still falling back to
  the existing "Coming soon" empty state since `content/lookbook.ts` is
  still empty.

**Manually verified in Chrome** — this is the site's one signature
interaction, so it was worth confirming for real rather than
code-review-only. Since no real photography exists, used a **temporary**
QA setup: `next.config.ts` briefly allowlisted `placehold.co` as a remote
image host, and `content/lookbook.ts` briefly held one test entry with two
distinctly colored placeholder images (hot pink "TOP" / cyan "UNDER").
Confirmed: default state shows the top layer fully; hovering partway
across the image reveals the under layer cleanly to the left of the
cursor with a hard edge (no crossfade); the boundary tracks pointer
movement smoothly; `onPointerLeave` correctly resets the clip-path to 0%
(verified directly via `el.style.clipPath` — a screenshot taken
mid-transition initially looked wrong, but the actual DOM state and a
follow-up screenshot after the 120ms transition settled both confirmed
the reset works). No console errors from the component itself (one
hydration-mismatch warning appeared, but it's from a browser extension
injecting `fdprocessedid` attributes into the Footer's newsletter form —
explicitly called out as a known cause in React's own error message,
unrelated to LayerWipe, and present on every page regardless). **Both the
`next.config.ts` change and the test content entry were reverted
immediately after verification** — confirmed via `grep -r "placehold.co"`
across `src/` and `next.config.ts` that nothing QA-related remains.
Touch/scroll-linked behavior and the reduced-motion bypass were not
independently verified in-browser (no touch emulation attempted this
round) — verified only by code review.

**Verification:** `tsc --noEmit` clean, `next lint` clean, `next build`
succeeds, both before adding the temporary QA content and after removing
it.

## Opus 5 review — Milestone 6

Verdict: "the component is fundamentally correct." All five focus areas
(hook-rule safety, clip-path direction/math, no QA leftovers, `fill`
structure, plan §3.4 fidelity) checked out — including specifically
verifying `useTransform` is called unconditionally and only the resulting
*value* (not the hook call) is chosen conditionally in the `style` prop,
which is the exact pattern that would violate Rules of Hooks if done
wrong. Two real must-fix bugs and several nice-to-haves:

**Must-fix — fixed:**

1. **`sizes` was wrong by ~2x at every breakpoint.** Hardcoded
   `(min-width: 768px) 25vw, 50vw` regardless of caller, but the lookbook
   grid is `grid-cols-1 md:grid-cols-2` — each image is ~100vw mobile,
   ~50vw desktop, not half that. Plan §5 calls this exact mistake out by
   name for this page ("this page will otherwise be your Lighthouse
   problem"). **Fixed** by making `sizes` a required prop instead of a
   hardcoded value inside the component — the caller (which knows its own
   grid) now passes the correct string; `/lookbook`'s page now passes
   `"(min-width: 768px) 50vw, 100vw"`.
2. **Duplicate `alt`** — both layers used `shot.alt`, so every shot was
   announced twice to assistive tech. **Fixed:** added `underAlt` to the
   `Shot` type (both layers show meaningfully different content, so a
   shared/empty alt would lose information, not just dedupe it) and
   threaded it through.

**Nice-to-have — addressed:**

- **Under layer never got `priority`.** Fixed — now receives the same
  `priority` prop as the top layer, so an above-fold shot's second layer
  isn't left to lazy-load and hover into a blank space.
- **Scroll offset range put the full reveal off-screen** — the original
  `["start end", "end start"]` spans the image's entire time anywhere in
  the viewport, so progress=1 (fully wiped) lands right as the image
  scrolls out of view, not while it's centered and visible. **Fixed:**
  narrowed to `["start 0.8", "end 0.2"]`, compressing the active range to
  roughly when the image is actually centered on screen.
- **Pointer-driven state caused a full component re-render on every
  `pointermove`.** Switched from `useState` to Motion's own
  `useMotionValue`/`useMotionTemplate` for the pointer-driven clip-path —
  same visual behavior, zero React re-renders per mouse move.
- **Generalized beyond the lookbook's `Shot` type.** Plan §3.4 explicitly
  covers "lookbook **and product** images," and Milestone 7 (Shop) will
  want this identical interaction on PDP galleries. `LayerWipe` no longer
  takes a `shot: Shot` prop — it now takes plain `src`/`alt`/`under`/
  `underAlt`/`sizes`/`priority` props, decoupled from any content type, so
  Shop can reuse it directly instead of duplicating the component.

**Not changed:** `useReducedMotion()` returns `null` on the server and
first client render (before resolving to a real boolean), so the two-layer
branch briefly renders and requests the under-layer image even for
reduced-motion users, correcting only after hydration. This is the same
accepted tradeoff already established in `Reveal.tsx` earlier in this log
— avoiding it entirely would mean either a hydration mismatch or an
SSR-side media query check, neither of which is possible for a client-only
preference. Left consistent with the existing precedent rather than
solving it differently in one component.

**Re-verified after fixes:** `tsc --noEmit` clean, `next lint` clean,
`next build` succeeds. Re-ran the same temporary placehold.co QA setup as
the first pass (revert-confirmed via `grep -r "placehold.co"` afterward,
finds nothing): the `useMotionValue`-based wipe still tracks the pointer
correctly post-refactor, sizing/columns render at full width as expected
from the `sizes` fix, no LayerWipe-specific console errors (only the
same known browser-extension `fdprocessedid` hydration warning on the
Footer form, unrelated and present site-wide).

Milestone 6 is considered done. Remaining work — Milestone 7 (Shop) — is
still blocked on the Shopify-vs-Stripe decision per plan §9.2, which
remains open.
