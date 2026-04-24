import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

type Pin = {
  id: string;
  name: string;
  profession: string;
  workshop_location: string;
  map_x: number | null;
  map_y: number | null;
};

const buildings = [
  { x: 8, y: 18, w: 26, h: 18, label: "Main Block", color: "var(--primary)" },
  { x: 42, y: 12, w: 22, h: 14, label: "Engineering", color: "var(--primary-glow)" },
  { x: 70, y: 18, w: 22, h: 22, label: "Library", color: "var(--primary)" },
  { x: 12, y: 56, w: 22, h: 18, label: "Hostel A", color: "var(--accent)" },
  { x: 40, y: 60, w: 24, h: 14, label: "Plaza", color: "var(--primary-glow)" },
  { x: 70, y: 58, w: 22, h: 20, label: "Workshops", color: "var(--primary)" },
];

export function CampusMap({ pins, height = 520 }: { pins: Pin[]; height?: number }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-border shadow-elegant bg-secondary"
      style={{ height }}
    >
      {/* Paths */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="oklch(0.88 0.02 85)" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <path d="M0,45 L100,45 M50,0 L50,100 M0,80 L100,80" stroke="oklch(0.85 0.04 80)" strokeWidth="2" strokeDasharray="1.5 1.5" fill="none" />
      </svg>

      {/* Buildings */}
      {buildings.map((b) => (
        <div
          key={b.label}
          className="absolute rounded-md flex items-end justify-center pb-1 text-[10px] font-medium text-primary-foreground/90 shadow-card"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            background: b.color,
          }}
        >
          {b.label}
        </div>
      ))}

      {/* Pins */}
      {pins.map((p, i) => {
        const x = Number(p.map_x ?? 50);
        const y = Number(p.map_y ?? 50);
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: -8, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
            className="absolute -translate-x-1/2 -translate-y-full group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Link to="/artisans/$id" params={{ id: p.id }} className="block">
              <div className="relative">
                <div className="bg-accent text-accent-foreground rounded-full p-1.5 shadow-elegant ring-2 ring-background">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-foreground text-background text-xs px-2 py-1 rounded-md shadow-elegant z-10">
                  <div className="font-semibold">{p.name}</div>
                  <div className="opacity-70">{p.profession}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
