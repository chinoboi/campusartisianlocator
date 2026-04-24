import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
    supabase.from("categories").select("*").order("name").then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    (async () => {
      let query = supabase.from("artisans").select("*, categories(slug, name)").order("rating", { ascending: false });
      const { data } = await query;
      setArtisans(data ?? []);
    })();
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
        <p className="text-muted-foreground py-16 text-center">No artisans match your search.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => <ArtisanCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
}
