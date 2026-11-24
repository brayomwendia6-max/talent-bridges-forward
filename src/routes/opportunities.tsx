import { createFileRoute, useHydrated } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock, MapPin, Search, Wallet, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
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
import { DemoBadge, LocalStorageNotice, PrivacyNotice } from "@/components/site/Notices";
import { CATEGORIES, OPPORTUNITIES } from "@/lib/demo-data";
import { filterOpportunities } from "@/lib/filter";
import { actions, useAppState } from "@/lib/store";
import type { Opportunity } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities – TalentBridge" },
      {
        name: "description",
        content: "Search internships, remote jobs, fellowships, and training. Filter by skill and category and apply.",
      },
      { property: "og:title", content: "Opportunities – TalentBridge" },
      { property: "og:description", content: "Find internships, remote jobs, fellowships, and training that match your skills." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OpportunitiesPage,
});

const ALL_SKILLS = Array.from(new Set(OPPORTUNITIES.flatMap((o) => o.skills))).sort();

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function OpportunitiesPage() {
  const hydrated = useHydrated();
  const state = useAppState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [skill, setSkill] = useState<string>("all");
  const [applying, setApplying] = useState<Opportunity | null>(null);

  const results = useMemo(() => filterOpportunities(OPPORTUNITIES, { query, category, skill }), [query, category, skill]);
  const appliedIds = new Set(hydrated ? state.applications.map((a) => a.opportunityId) : []);
  const hasFilters = query || category !== "all" || skill !== "all";

  return (
    <>
      <PageHeader
        eyebrow="Step 3"
        title="Opportunities"
        description="Internships, remote jobs, fellowships, and training. Search by keyword or filter by skill and category."
      >
        <DemoBadge label="All listings below are demo data" className="text-sm" />
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search opportunities"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, organization, or location"
                className="h-11 pl-9"
              />
            </div>
            <Select value={skill} onValueChange={setSkill}>
              <SelectTrigger aria-label="Filter by skill" className="h-11">
                <SelectValue placeholder="Any skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any skill</SelectItem>
                {ALL_SKILLS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {["all", ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  category === c ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {c === "all" ? "All categories" : c}
              </button>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={() => { setQuery(""); setCategory("all"); setSkill("all"); }}
                className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline"
              >
                <X className="size-4" /> Clear filters
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          Showing {results.length} of {OPPORTUNITIES.length} opportunities
        </p>

        {results.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed p-10 text-center">
            <p className="font-semibold">No opportunities match your search.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different word or clear the filters.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {results.map((op) => {
              const applied = appliedIds.has(op.id);
              return (
                <article key={op.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-shadow hover:shadow-lift sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="teal">{op.category}</Badge>
                    <DemoBadge />
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{op.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{op.organization}</p>
                  <p className="mt-3 flex-1 text-sm">{op.description}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5"><MapPin className="size-4 shrink-0" /><dd>{op.location}</dd></div>
                    <div className="flex items-center gap-1.5"><Clock className="size-4 shrink-0" /><dd>{op.duration}</dd></div>
                    <div className="flex items-center gap-1.5"><Wallet className="size-4 shrink-0" /><dd>{op.pay}</dd></div>
                    <div className="flex items-center gap-1.5"><CalendarDays className="size-4 shrink-0" /><dd>Apply by {formatDate(op.deadline)}</dd></div>
                  </dl>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {op.skills.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => setSkill(s)}
                          className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors", skill === s ? "bg-teal text-secondary-foreground" : "bg-muted hover:bg-teal-soft")}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 border-t pt-4">
                    {applied ? (
                      <p className="flex items-center gap-2 text-sm font-semibold text-teal"><CheckCircle2 className="size-5" /> You applied (saved on this device)</p>
                    ) : (
                      <Button onClick={() => setApplying(op)} className="w-full sm:w-auto">Apply now</Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {hydrated && state.applications.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">My applications</h2>
            <ul className="mt-4 divide-y rounded-2xl border bg-card shadow-card">
              {state.applications.map((a) => (
                <li key={a.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{a.opportunityTitle}</p>
                    <p className="text-sm text-muted-foreground">{a.organization} · {new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { actions.removeApplication(a.id); toast.success("Application withdrawn."); }}>
                    Withdraw
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <LocalStorageNotice className="mt-10" />
      </div>

      <Dialog open={!!applying} onOpenChange={(o) => !o && setApplying(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {applying && (
            <ApplyForm
              key={applying.id}
              op={applying}
              defaultName={state.profile.name}
              onDone={() => setApplying(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ApplyForm({ op, defaultName, onDone }: { op: Opportunity; defaultName: string; onDone: () => void }) {
  const [form, setForm] = useState({ name: defaultName, email: "", phone: "", message: "", portfolioLink: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs["name"] = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs["email"] = "Please enter a valid email.";
    if (form.message.trim().length < 20) errs["message"] = "Please write at least 20 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    actions.addApplication({
      opportunityId: op.id,
      opportunityTitle: op.title,
      organization: op.organization,
      ...form,
    });
    toast.success("Application saved!", { description: "This is a demo — it was saved on your device, not sent to the organization." });
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <DialogHeader>
        <DialogTitle>Apply: {op.title}</DialogTitle>
        <DialogDescription>{op.organization}</DialogDescription>
      </DialogHeader>
      <p className="rounded-lg bg-demo p-3 text-sm text-demo-foreground">
        This is a demo listing. Your application is saved on this device only and is not sent to anyone.
      </p>
      <div className="space-y-2">
        <Label htmlFor="ap-name">Full name *</Label>
        <Input id="ap-name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors["name"]} />
        {errors["name"] && <p className="text-sm text-destructive">{errors["name"]}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ap-email">Email *</Label>
          <Input id="ap-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors["email"]} />
          {errors["email"] && <p className="text-sm text-destructive">{errors["email"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ap-phone">Phone (optional)</Label>
          <Input id="ap-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ap-msg">Why are you a good fit? *</Label>
        <Textarea id="ap-msg" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell them about your skills and experience." aria-invalid={!!errors["message"]} />
        {errors["message"] && <p className="text-sm text-destructive">{errors["message"]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="ap-link">Portfolio or CV link (optional)</Label>
        <Input id="ap-link" type="url" value={form.portfolioLink} onChange={(e) => set("portfolioLink", e.target.value)} placeholder="https://" />
      </div>
      <PrivacyNotice />
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit">Submit application</Button>
      </DialogFooter>
    </form>
  );
}
