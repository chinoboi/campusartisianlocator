import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Clock, Star, ShieldCheck } from "lucide-react";

type Artisan = {
  id: string;
  name: string;
  profession: string;
  phone: string;
  workshop_location: string;
  available_hours: string | null;
  rating: number | null;
  is_available: boolean;
  photo_url: string | null;
  phone_verified?: boolean;
};

export function ArtisanCard({ a }: { a: Artisan }) {
  const initials = a.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <Link
      to="/artisans/$id"
      params={{ id: a.id }}
      className="group block bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-hero text-primary-foreground font-display font-bold text-xl flex items-center justify-center shrink-0">
          {a.photo_url ? (
            <img src={a.photo_url} alt={a.name} className="h-full w-full rounded-xl object-cover" />
          ) : initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-display font-semibold text-lg text-foreground truncate">{a.name}</h3>
              {a.phone_verified && (
                <span title="Phone verified by admin" className="text-primary shrink-0"><ShieldCheck className="h-4 w-4" /></span>
              )}
            </div>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${a.is_available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {a.is_available ? "Available" : "Off"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{a.profession}</p>
          {a.rating ? (
            <div className="flex items-center gap-1 mt-1 text-xs text-accent">
              <Star className="h-3 w-3 fill-current" /> {Number(a.rating).toFixed(1)}
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{a.workshop_location}</span></div>
        {a.available_hours && <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 shrink-0" /> {a.available_hours}</div>}
        <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> {a.phone}</div>
      </div>
    </Link>
  );
}
