export function Footer() {
  return (
    <footer className="border-t border-paper/20 px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="type-display text-2xl text-hot">2ECOND2KIN MAGAZINE</p>
          <p className="mt-2 type-meta text-meta text-paper/60">
            &copy; {new Date().getFullYear()} 2econd2kin Magazine
          </p>
        </div>
      </div>
    </footer>
  );
}
