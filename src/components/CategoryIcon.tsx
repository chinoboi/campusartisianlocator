import { Zap, Wrench, Hammer, Footprints, Sparkles, Briefcase } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Wrench, Hammer, Footprints, Sparkles,
};

export function CategoryIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && ICONS[name]) || Briefcase;
  return <Icon className={className} />;
}
