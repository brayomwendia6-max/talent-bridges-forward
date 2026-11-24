import { createFileRoute, useHydrated } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, Languages, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/site/PageHeader";
import { DemoBadge, LocalStorageNotice } from "@/components/site/Notices";
import { MENTORS, MENTORSHIP_TOPICS } from "@/lib/demo-data";
import { actions, useAppState } from "@/lib/store";
import type { Mentor } from "@/lib/types";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      { title: "Mentorship – TalentBridge" },
      { name: "description", content: "Meet experienced mentors and request help with your CV, job search, and career." },
      { property: "og:title", content: "Mentorship – TalentBridge" },
      { property: "og:description", content: "Connect with mentors who can help you find work that matches your skills." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MentorshipPage,
});

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

function MentorshipPage() {
  const hydrated = useHydrated();
  const state = useAppState();
  const [query, setQuery] = useState("");
  const [requesting, setRequesting] = useState<Mentor | null>(null);

  const q = query.trim().toLowerCase();
  const mentors = MENTORS.filter((m) =>
    !q || [m.name, m.role, m.location, ...m.expertise, ...m.languages].join(" ").toLowerCase().includes(q),
  );
  const requests = hydrated ? state.mentorshipRequests : [];
  const requestedIds = new Set(requests.map((r) => r.mentorId));

  return (
    <>
      <PageHeader
        eyebrow="Step 4"
        title="Mentorship"
        description="Mentors are experienced professionals who can give advice on your CV, job search, and career. Choose one and send a request."
      >
        <DemoBadge label="Mentor profiles are demo data" className="text-sm" />
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search mentors" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by skill, language, or name" className="h-11 pl-9" />
        </div>

        {mentors.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No mentors match your search.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <article key={m.id} className="flex flex-col rounded-2xl border bg-card p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-hero font-display text-lg font-bold text-navy-foreground">
                    {initials(m.name)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-tight">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                    <p className="text-xs text-muted-foreground">{m.organization}</p>
                  </div>
                </div>
                <DemoBadge className="mt-3 self-start" />
                <p className="mt-3 flex-1 text-sm">{m.bio}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {m.expertise.map((e) => <li key={e}><Badge variant="teal">{e}</Badge></li>)}
                </ul>
                <dl className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><MapPin className="size-4" /><dd>{m.location}</dd></div>
                  <div className="flex items-center gap-2"><Languages className="size-4" /><dd>{m.languages.join(", ")}</dd></div>
                  <div className="flex items-center gap-2"><CalendarClock className="size-4" /><dd>{m.availability}</dd></div>
                </dl>
                <div className="mt-5 border-t pt-4">
                  {requestedIds.has(m.id) ? (
                    <p className="flex items-center gap-2 text-sm font-semibold text-teal"><CheckCircle2 className="size-5" /> Request sent</p>
                  ) : (
                    <Button className="w-full" onClick={() => setRequesting(m)}>Request mentorship</Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {requests.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">My mentorship requests</h2>
            <ul className="mt-4 divide-y rounded-2xl border bg-card shadow-card">
              {requests.map((r) => (
                <li key={r.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{r.mentorName} · {r.topic}</p>
                    <p className="text-sm text-muted-foreground">{r.goal}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Sent {new Date(r.createdAt).toLocaleDateString()} · Status: waiting (demo)</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { actions.removeMentorshipRequest(r.id); toast.success("Request cancelled."); }}>
                    Cancel request
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <LocalStorageNotice className="mt-10" />
      </div>

      <Dialog open={!!requesting} onOpenChange={(o) => !o && setRequesting(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {requesting && (
            <RequestForm key={requesting.id} mentor={requesting} defaultName={state.profile.name} onDone={() => setRequesting(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function RequestForm({ mentor, defaultName, onDone }: { mentor: Mentor; defaultName: string; onDone: () => void }) {
  const [form, setForm] = useState({
    name: defaultName,
    email: "",
    topic: mentor.expertise[0] ?? "Other",
    goal: "",
    preferredContact: "Email",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const topics = Array.from(new Set([...mentor.expertise, ...MENTORSHIP_TOPICS]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs["name"] = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs["email"] = "Please enter a valid email.";
    if (form.goal.trim().length < 10) errs["goal"] = "Please describe your goal in a few words.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    actions.addMentorshipRequest({ mentorId: mentor.id, mentorName: mentor.name, ...form });
    toast.success(`Request to ${mentor.name} saved!`, { description: "Demo only — saved on your device, not sent to the mentor." });
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <DialogHeader>
        <DialogTitle>Request mentorship from {mentor.name}</DialogTitle>
        <DialogDescription>{mentor.role}</DialogDescription>
      </DialogHeader>
      <p className="rounded-lg bg-demo p-3 text-sm text-demo-foreground">
        This mentor is a demo profile. Your request is saved on this device only.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mr-name">Your name *</Label>
          <Input id="mr-name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors["name"]} />
          {errors["name"] && <p className="text-sm text-destructive">{errors["name"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mr-email">Email *</Label>
          <Input id="mr-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors["email"]} />
          {errors["email"] && <p className="text-sm text-destructive">{errors["email"]}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mr-topic">Topic</Label>
          <Select value={form.topic} onValueChange={(v) => set("topic", v)}>
            <SelectTrigger id="mr-topic"><SelectValue /></SelectTrigger>
            <SelectContent>
              {topics.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mr-contact">Best way to reach you</Label>
          <Select value={form.preferredContact} onValueChange={(v) => set("preferredContact", v)}>
            <SelectTrigger id="mr-contact"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Email", "Video call", "Phone call", "Chat message"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mr-goal">What would you like help with? *</Label>
        <Textarea id="mr-goal" rows={4} value={form.goal} onChange={(e) => set("goal", e.target.value)} placeholder="e.g. I want to find a nursing job and need help with my CV." aria-invalid={!!errors["goal"]} />
        {errors["goal"] && <p className="text-sm text-destructive">{errors["goal"]}</p>}
      </div>
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit">Send request</Button>
      </DialogFooter>
    </form>
  );
}
