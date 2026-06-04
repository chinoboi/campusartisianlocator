import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, ArrowRight } from "lucide-react";
import { mockDb } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ArtisanCard } from "@/components/ArtisanCard";
import { CampusMap } from "@/components/CampusMap";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Campus Artisan Locator — Find skilled workers on campus" },
      { name: "description", content: "Search electricians, plumbers, carpenters, cobblers and cleaners on campus." },
    ],
  }),
});

function Index() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    setCategories(mockDb.getCategories());
    const all = mockDb.getArtisans(false);
    setPins(all);
    const sorted = [...all].sort((a, b) => b.rating - a.rating).slice(0, 4);
    setFeatured(sorted);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-6">
              <span className="h-px w-8 bg-accent" /> Find help on campus
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-foreground text-balance">
              Every skilled <em className="text-accent not-italic">hand</em> on campus, one search away.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              From a dripping tap in the hostel to a torn shoe before lectures — locate the right artisan,
              see where their workshop is, and call them in seconds.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); window.location.href = `/artisans?q=${encodeURIComponent(q)}`; }}
              className="mt-8 flex gap-2 bg-card rounded-2xl shadow-elegant p-2 border border-border max-w-xl"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, profession or location…"
                  className="border-0 shadow-none focus-visible:ring-0 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl">Find</Button>
            </form>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <Link to="/map" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <MapPin className="h-4 w-4 text-primary" /> Campus map view
              </Link>
              <Link to="/artisans" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <Phone className="h-4 w-4 text-primary" /> Tap to call
              </Link>
              <a href="#categories" className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <Search className="h-4 w-4 text-primary" /> Browse by trade
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative w-full">
            <div className="absolute -inset-4 bg-hero opacity-20 blur-3xl rounded-full" />
            <div className="relative border border-border rounded-3xl shadow-elegant overflow-hidden bg-background">
              <CampusMap pins={pins} height={460} />
              <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border text-xs font-bold shadow-sm text-foreground">
                Top Faith Campus Map
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Browse by trade</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Categories</h2>
          </div>
          <Link to="/categories" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to="/artisans" search={{ category: c.slug } as any} className="block bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-hero group-hover:text-primary-foreground transition-colors">
                  <CategoryIcon name={c.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mt-4 text-foreground">{c.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Top rated</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Trusted artisans</h2>
          </div>
          <Link to="/artisans" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl py-12 px-6 text-center bg-card">
            <p className="text-muted-foreground">
              No verified artisans yet. Are you one?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">Register here</Link>.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((a) => <ArtisanCard key={a.id} a={a} />)}
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-hero rounded-3xl p-10 md:p-16 text-center shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <h2 className="relative font-display text-3xl md:text-5xl font-bold text-primary-foreground text-balance max-w-2xl mx-auto">
            See every workshop on the campus map.
          </h2>
          <p className="relative mt-4 text-primary-foreground/80 max-w-xl mx-auto">
            A clear, illustrated map shows you exactly where each artisan is located.
          </p>
          <Link to="/map" className="relative inline-flex mt-8">
            <Button size="lg" variant="secondary" className="rounded-xl">Open campus map <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
