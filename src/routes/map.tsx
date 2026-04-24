import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CampusMap } from "@/components/CampusMap";

export const Route = createFileRoute("/map")({
  component: MapPage,
  head: () => ({
    meta: [
      { title: "Campus Map — Campus Artisan Locator" },
      { name: "description", content: "Visual campus map showing every artisan workshop." },
    ],
  }),
});

function MapPage() {
  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("artisans").select("id,name,profession,workshop_location,map_x,map_y").then(({ data }) => setPins(data ?? []));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Where to find them</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Campus map</h1>
        <p className="mt-3 text-muted-foreground">Hover any pin to see the artisan, click to open their profile.</p>
      </header>

      <CampusMap pins={pins} height={620} />

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary" /> Buildings</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent" /> Artisan workshops</div>
      </div>
    </div>
  );
}
