import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, MapPin, Clock, Star, ArrowLeft } from "lucide-react";
import { mockDb } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { CampusMap } from "@/components/CampusMap";

export const Route = createFileRoute("/artisans/$id")({
  component: ArtisanDetail,
});

function ArtisanDetail() {
  const { id } = Route.useParams();
  const [a, setA] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const art = mockDb.getArtisan(id);
    if (art) {
      const cats = mockDb.getCategories();
      const cat = cats.find((c) => c.id === art.category_id);
      setA({
        ...art,
        categories: cat ? { name: cat.name, slug: cat.slug } : null,
      });
    } else {
      setA(null);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-16 text-muted-foreground">Loading…</div>;
  if (!a) return <div className="max-w-5xl mx-auto px-6 py-16">Not found. <Link to="/artisans" className="text-primary underline">Back</Link></div>;

  const initials = a.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("");

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/artisans" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to directory
      </Link>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <div className="bg-card rounded-3xl border border-border p-8 shadow-elegant">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-2xl bg-hero text-primary-foreground font-display font-bold text-3xl flex items-center justify-center">
                {initials}
              </div>
              <div className="flex-1">
                {a.categories && (
                  <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-1">{a.categories.name}</p>
                )}
                <h1 className="font-display text-3xl font-bold text-foreground">{a.name}</h1>
                <p className="text-muted-foreground">{a.profession}</p>
                {a.rating ? (
                  <div className="flex items-center gap-1 mt-2 text-accent text-sm">
                    <Star className="h-4 w-4 fill-current" /> {Number(a.rating).toFixed(1)}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div><p className="text-foreground font-medium">Workshop location</p><p className="text-muted-foreground">{a.workshop_location}</p></div>
              </div>
              {a.available_hours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary mt-0.5" />
                  <div><p className="text-foreground font-medium">Hours</p><p className="text-muted-foreground">{a.available_hours}</p></div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <div><p className="text-foreground font-medium">Phone</p><p className="text-muted-foreground">{a.phone}</p></div>
              </div>
            </div>

            {a.bio && <p className="mt-6 text-foreground/80 leading-relaxed border-t border-border pt-6">{a.bio}</p>}

            <div className="mt-6 flex gap-2">
              <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="flex-1">
                <Button className="w-full" size="lg"><Phone className="h-4 w-4 mr-2" /> Call now</Button>
              </a>
              <a href={`sms:${a.phone.replace(/\s/g, "")}`} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">Send SMS</Button>
              </a>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">Find on campus</p>
          <CampusMap pins={[a]} height={460} />
        </div>
      </div>
    </div>
  );
}
