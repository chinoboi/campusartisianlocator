import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CategoryIcon } from "@/components/CategoryIcon";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories — Campus Artisan Locator" },
      { name: "description", content: "Browse artisan categories on campus: electricians, plumbers, carpenters, cobblers and cleaners." },
    ],
  }),
});

function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from("categories").select("*").order("name");
      setCategories(cats ?? []);
      const { data: artisans } = await supabase.from("artisans").select("category_id");
      const c: Record<string, number> = {};
      (artisans ?? []).forEach((a: any) => { c[a.category_id] = (c[a.category_id] ?? 0) + 1; });
      setCounts(c);
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">All trades</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Browse by category</h1>
        <p className="mt-3 text-muted-foreground">Pick a trade to see every artisan on campus, their workshop location and contact details.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/artisans"
            search={{ category: c.slug } as any}
            className="group bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-hero group-hover:text-primary-foreground transition-colors">
                <CategoryIcon name={c.icon} className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold text-xl text-foreground">{c.name}</h2>
                  <span className="text-sm text-muted-foreground">{counts[c.id] ?? 0}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
