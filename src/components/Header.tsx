import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { mockDb } from "@/lib/mockDb";
import logoImg from "@/assets/top-faith-logo.png";

export function Header() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoImg}
            alt="Top Faith University Logo"
            className="h-9 w-9 rounded-lg shadow-card object-cover"
          />
          <div className="leading-tight">
            <div className="font-display font-bold text-lg text-foreground">Campus Artisans</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Locator</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/categories" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Categories</Link>
          <Link to="/artisans" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Artisans</Link>
          <Link to="/map" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Campus Map</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/register" className="hidden sm:inline-flex">
            <Button size="sm" variant="outline">Register as artisan</Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={() => mockDb.signOut()}>Sign out</Button>
          ) : (
            <Link to="/auth"><Button size="sm" variant="ghost">Sign in</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}
