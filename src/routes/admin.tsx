import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Campus Artisan Locator" }] }),
});

const empty = {
  id: "", name: "", profession: "", phone: "", workshop_location: "",
  available_hours: "", bio: "", category_id: "", map_x: 50, map_y: 50, is_available: true, is_approved: true,
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const refresh = async () => {
    const { data: a } = await supabase.from("artisans").select("*, categories(name)").order("is_approved", { ascending: true }).order("created_at", { ascending: false });
    setArtisans(a ?? []);
    const { data: c } = await supabase.from("categories").select("*").order("name");
    setCategories(c ?? []);
  };

  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-16 text-muted-foreground">Loading…</div>;

  if (user && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Admin access required</h1>
        <p className="mt-3 text-muted-foreground">Your account ({user.email}) is signed in but not an admin yet.</p>
        <div className="mt-6 bg-card border border-border rounded-2xl p-6 text-left text-sm">
          <p className="font-semibold text-foreground mb-2">To grant admin rights, run this in the database:</p>
          <pre className="bg-secondary p-3 rounded-md overflow-x-auto text-xs">{`INSERT INTO public.user_roles (user_id, role)\nVALUES ('${user.id}', 'admin');`}</pre>
        </div>
      </div>
    );
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload: any = { ...editing };
    delete payload.categories;
    if (!payload.category_id) payload.category_id = null;
    payload.map_x = Number(payload.map_x);
    payload.map_y = Number(payload.map_y);

    const { id, ...rest } = payload;
    const { error } = id
      ? await supabase.from("artisans").update(rest).eq("id", id)
      : await supabase.from("artisans").insert(rest);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this artisan?")) return;
    const { error } = await supabase.from("artisans").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Admin panel</p>
          <h1 className="font-display text-4xl font-bold text-foreground">Manage artisans</h1>
        </div>
        <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-2" /> New artisan</Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground text-left">
            <tr>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Profession</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium w-32"></th>
            </tr>
          </thead>
          <tbody>
            {artisans.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No artisans yet. Submissions from the public registration form will appear here for approval.</td></tr>
            )}
            {artisans.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-4">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${a.is_approved ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent"}`}>
                    {a.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="p-4 font-medium text-foreground">{a.name}{a.submitted_by_email && <div className="text-xs text-muted-foreground font-normal">{a.submitted_by_email}</div>}</td>
                <td className="p-4 text-muted-foreground">{a.profession}</td>
                <td className="p-4 text-muted-foreground">{a.phone}</td>
                <td className="p-4 text-muted-foreground">{a.workshop_location}</td>
                <td className="p-4 text-right whitespace-nowrap">
                  {!a.is_approved && (
                    <button onClick={async () => { const { error } = await supabase.from("artisans").update({ is_approved: true }).eq("id", a.id); if (error) return toast.error(error.message); toast.success("Approved"); refresh(); }} className="inline-flex p-2 hover:bg-secondary rounded-md text-primary" title="Approve"><Check className="h-4 w-4" /></button>
                  )}
                  <button onClick={() => setEditing(a)} className="inline-flex p-2 hover:bg-secondary rounded-md"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(a.id)} className="inline-flex p-2 hover:bg-secondary rounded-md text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="bg-card rounded-2xl shadow-elegant border border-border p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">{editing.id ? "Edit artisan" : "New artisan"}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Profession</Label><Input required value={editing.profession} onChange={(e) => setEditing({ ...editing, profession: e.target.value })} /></div>
              <div><Label>Phone</Label><Input required value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
              <div>
                <Label>Category</Label>
                <Select value={editing.category_id ?? ""} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>Workshop location</Label><Input required value={editing.workshop_location} onChange={(e) => setEditing({ ...editing, workshop_location: e.target.value })} /></div>
              <div><Label>Available hours</Label><Input value={editing.available_hours ?? ""} onChange={(e) => setEditing({ ...editing, available_hours: e.target.value })} /></div>
              <div className="flex items-center gap-3 pt-6"><Switch checked={editing.is_available} onCheckedChange={(v) => setEditing({ ...editing, is_available: v })} /><Label>Currently available</Label></div>
              <div className="flex items-center gap-3 pt-6"><Switch checked={editing.is_approved} onCheckedChange={(v) => setEditing({ ...editing, is_approved: v })} /><Label>Approved (publicly visible)</Label></div>
              <div><Label>Map X (0–100)</Label><Input type="number" min="0" max="100" value={editing.map_x} onChange={(e) => setEditing({ ...editing, map_x: e.target.value })} /></div>
              <div><Label>Map Y (0–100)</Label><Input type="number" min="0" max="100" value={editing.map_y} onChange={(e) => setEditing({ ...editing, map_y: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Bio</Label><Textarea value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} /></div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
