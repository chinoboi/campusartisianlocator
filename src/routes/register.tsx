import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { normalizeNigeriaPhone, formatNigeriaPhoneDisplay } from "@/lib/phone";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: "Register as an artisan — Campus Artisan Locator" },
      { name: "description", content: "Are you a skilled worker on campus? Submit your details to be listed in the directory." },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  profession: z.string().trim().min(2, "Profession is required").max(100),
  workshop_location: z.string().trim().min(2, "Location is required").max(200),
  available_hours: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(500).optional(),
  submitted_by_email: z.string().trim().email("Enter a valid email").max(255),
  category_id: z.string().uuid().optional().or(z.literal("")),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "", profession: "", phone: "", workshop_location: "",
    available_hours: "", bio: "", submitted_by_email: "", category_id: "",
  });

  const normalizedPhone = normalizeNigeriaPhone(form.phone);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => setCategories(data ?? []));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedPhone) {
      return toast.error("Enter a valid Nigerian mobile number (e.g. 0801 234 5678)");
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
    }
    setBusy(true);
    const payload: any = {
      ...parsed.data,
      phone: normalizedPhone,
      is_approved: false,
      phone_verified: false,
    };
    if (!payload.category_id) delete payload.category_id;
    const { error } = await supabase.from("artisans").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Submitted for review</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you. An admin will review your details and approve your listing shortly.
          You'll appear in the directory once approved.
        </p>
        <Button className="mt-8" onClick={() => navigate({ to: "/" })}>Back to home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Join the directory</p>
        <h1 className="font-display text-4xl font-bold text-foreground">Register as an artisan</h1>
        <p className="mt-3 text-muted-foreground">
          Are you a skilled worker on campus? Submit your real details below. An admin will verify and approve
          before your profile becomes public.
        </p>
      </header>

      <form onSubmit={submit} className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Full name *</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Profession *</Label>
            <Input required placeholder="e.g. Electrician" value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
          </div>
          <div>
            <Label>Phone number *</Label>
            <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Your email *</Label>
            <Input required type="email" placeholder="for admin to contact you" value={form.submitted_by_email} onChange={(e) => setForm({ ...form, submitted_by_email: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Workshop location on campus *</Label>
            <Input required placeholder="e.g. Behind Hall 3, near the cafeteria" value={form.workshop_location} onChange={(e) => setForm({ ...form, workshop_location: e.target.value })} />
          </div>
          <div>
            <Label>Available hours</Label>
            <Input placeholder="e.g. Mon–Sat, 9am–6pm" value={form.available_hours} onChange={(e) => setForm({ ...form, available_hours: e.target.value })} />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Short bio</Label>
            <Textarea rows={4} placeholder="Tell students about your experience…" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit for review"}</Button>
        </div>
      </form>
    </div>
  );
}
