export function Footer() {
  return (
    <footer className="border-t border-paper/20 px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="type-display text-2xl text-hot">2ECOND2KIN</p>
          <p className="mt-2 type-meta text-meta text-paper/60">
            &copy; {new Date().getFullYear()} 2econd2kin
          </p>
        </div>
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
            className="shrink-0 bg-acid px-4 py-3 type-meta text-meta text-ink hover:bg-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot"
          >
            Join
          </button>
        </form>
      </div>
    </footer>
  );
}
