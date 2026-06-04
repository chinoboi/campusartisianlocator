import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { mockDb } from "@/lib/mockDb";
import { Input } from "@/components/ui/input";
import { ArtisanCard } from "@/components/ArtisanCard";
import { z } from "zod";

const search = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/artisans")({
  validateSearch: search,
  component: ArtisansPage,
  head: () => ({
    meta: [
      { title: "Artisans — Campus Artisan Locator" },
      { name: "description", content: "Browse and search every artisan available on campus." },
    ],
  }),
});

function ArtisansPage() {
  const { q: initialQ, category } = Route.useSearch();
  const [q, setQ] = useState(initialQ ?? "");
  const [artisans, setArtisans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<string | undefined>(category);

  useEffect(() => {
    const cats = mockDb.getCategories();
    setCategories(cats);
    const arts = mockDb.getArtisans(false).map((a) => {
      const cat = cats.find((c) => c.id === a.category_id);
      return {
        ...a,
        categories: cat ? { name: cat.name, slug: cat.slug } : null,
      };
    });
    // Sort by rating descending
    arts.sort((a, b) => b.rating - a.rating);
    setArtisans(arts);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return artisans.filter((a) => {
      if (activeCat && a.categories?.slug !== activeCat) return false;
      if (!term) return true;
      return [a.name, a.profession, a.workshop_location].some((v) => String(v).toLowerCase().includes(term));
    });
  }, [artisans, q, activeCat]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Directory</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">All artisans</h1>
      </header>

      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2 bg-card rounded-2xl shadow-card p-2 border border-border max-w-xl">
          <Search className="h-5 w-5 text-muted-foreground ml-3" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, profession or location…"
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat(undefined)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${!activeCat ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary"}`}
          >All</button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${activeCat === c.slug ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary"}`}
            >{c.name}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl py-16 px-6 text-center bg-card">
          <h3 className="font-display text-2xl font-semibold text-foreground">No artisans listed yet</h3>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            The directory only shows real, verified artisans. Are you a skilled worker on campus?
          </p>
          <a href="/register" className="inline-flex mt-6 items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            Register as an artisan
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => <ArtisanCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
}
