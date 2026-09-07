// Not rendered anywhere for this iteration of the site — the form has no
// backend wired up yet (no action/onSubmit, no email provider). Kept
// as-is so it can just be dropped back into Footer once that's ready.
export function NewsletterSignup() {
  return (
    <form className="flex w-full max-w-sm items-center gap-2 md:w-auto">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="EMAIL"
        className="w-full border border-paper/40 bg-transparent px-4 py-3 type-meta text-meta text-paper placeholder:text-paper/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-hot"
      />
      <button
        type="submit"
        className="shrink-0 bg-acid px-4 py-3 type-meta text-meta text-black hover:bg-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot"
      >
        Join
      </button>
    </form>
  );
}
