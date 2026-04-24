export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p className="font-display text-base text-foreground">Campus Artisan Locator</p>
        <p>Connecting students to trusted hands on campus.</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
