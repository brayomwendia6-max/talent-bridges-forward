import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { Award, ExternalLink, FolderKanban, Image as ImageIcon, Info, Pencil, Plus, Trash2 } from "lucide-react";
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
import { DemoBadge, EvidenceBadge, EvidenceLegend, LocalStorageNotice } from "@/components/site/Notices";
import { itemHasEvidence, portfolioItemStatus, skillStatus } from "@/lib/evidence";
import { TagInput } from "@/components/site/TagInput";
import { actions, useAppState } from "@/lib/store";
import type { PortfolioItem, PortfolioType } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Skills Portfolio – TalentBridge" },
      {
        name: "description",
        content: "Showcase your projects, certificates, and examples of your work. Skills are labeled self-reported.",
      },
      { property: "og:title", content: "Skills Portfolio – TalentBridge" },
      { property: "og:description", content: "Show your projects, certificates, and work samples in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PortfolioPage,
});

const TYPE_META: Record<PortfolioType, { label: string; icon: typeof Award }> = {
  project: { label: "Project", icon: FolderKanban },
  certificate: { label: "Certificate", icon: Award },
  "work-sample": { label: "Work sample", icon: ImageIcon },
};

const DEMO_EXAMPLES: Omit<PortfolioItem, "id" | "createdAt">[] = [
  {
    type: "project",
    title: "Clinic appointment booking website",
    description: "Built a simple website so patients could book visits online. Reduced phone calls by about half.",
    link: "",
    issuer: "",
    date: "2023",
    skills: ["HTML & CSS", "JavaScript"],
  },
  {
    type: "certificate",
    title: "Google Data Analytics Certificate",
    description: "Online course covering spreadsheets, SQL, and data visualization.",
    link: "https://example.com/certificate",
    issuer: "Coursera (example)",
    date: "2024",
    skills: ["Data Analysis", "SQL"],
  },
  {
    type: "work-sample",
    title: "Tailored wedding dress collection",
    description: "Photos and notes from 12 custom dresses designed and sewn for clients.",
    link: "",
    issuer: "",
    date: "2022",
    skills: ["Tailoring", "Pattern Making"],
  },
];

type Draft = Omit<PortfolioItem, "id" | "createdAt"> & { id?: string; createdAt?: string };
const EMPTY_DRAFT: Draft = { type: "project", title: "", description: "", link: "", issuer: "", date: "", skills: [] };

function PortfolioPage() {
  const hydrated = useHydrated();
  const state = useAppState();
  const [filter, setFilter] = useState<PortfolioType | "all">("all");
  const [editing, setEditing] = useState<Draft | null>(null);

  const items = state.portfolio.filter((i) => filter === "all" || i.type === filter);

  return (
    <>
      <PageHeader
        eyebrow="Step 2"
        title="Skills Portfolio"
        description="Show examples of what you can do: projects you built, certificates you earned, and samples of your work."
      >
        <Button size="lg" variant="secondary" onClick={() => setEditing({ ...EMPTY_DRAFT })}>
          <Plus /> Add an item
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <div className="flex gap-3 rounded-xl border bg-card p-4 text-sm shadow-card">
          <Info className="mt-0.5 size-5 shrink-0 text-teal" />
          <div className="space-y-1">
            <p>
              <strong>About verification:</strong> TalentBridge does not officially verify skills,
              certificates, or qualifications. Items start as <strong>Self-Reported</strong>.
            </p>
            <p className="text-muted-foreground">
              Add a link or describe your evidence (a certificate, project, or work sample) to show
              <strong> Evidence Provided</strong>. Skills listed on an item with evidence get the same label.
            </p>
          </div>
        </div>

        <EvidenceLegend />

        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">My skills</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">Edit skills</Link>
            </Button>
          </div>
          {hydrated && state.profile.skills.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {state.profile.skills.map((s) => (
                <li key={s} className="inline-flex items-center gap-2 rounded-full border py-1 pl-3 pr-1.5 text-sm font-medium">
                  {s}
                  <EvidenceBadge status={skillStatus(s, state.portfolio)} className="rounded-full px-2 py-0 text-[10px]" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No skills yet. Add them on your <Link to="/profile" className="font-semibold text-teal underline">profile</Link>.
            </p>
          )}
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">My work</h2>
            <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1" role="tablist">
              {(["all", "project", "certificate", "work-sample"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={filter === t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    filter === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "all" ? "All" : TYPE_META[t].label + "s"}
                </button>
              ))}
            </div>
          </div>

          {hydrated && state.portfolio.length > 0 ? (
            items.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    onEdit={() => setEditing(item)}
                    onDelete={() => {
                      actions.removePortfolioItem(item.id);
                      toast.success("Item removed.");
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                No items of this type yet.
              </p>
            )
          ) : (
            <div className="mt-6">
              <div className="rounded-2xl border border-dashed p-8 text-center">
                <p className="font-semibold">You have not added any work yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">Here are some examples to give you ideas.</p>
                <Button className="mt-4" onClick={() => setEditing({ ...EMPTY_DRAFT })}>
                  <Plus /> Add your first item
                </Button>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DEMO_EXAMPLES.map((ex) => (
                  <PortfolioCard key={ex.title} item={{ ...ex, id: ex.title, createdAt: "" }} demo />
                ))}
              </div>
            </div>
          )}
        </section>

        <LocalStorageNotice />
      </div>

      <ItemDialog draft={editing} onClose={() => setEditing(null)} />
    </>
  );
}

function PortfolioCard({
  item,
  demo,
  onEdit,
  onDelete,
}: {
  item: PortfolioItem;
  demo?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const meta = TYPE_META[item.type];
  const status = portfolioItemStatus(item);
  return (
    <article className={cn("flex flex-col rounded-2xl border bg-card p-5 shadow-card", demo && "opacity-90")}>
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-soft px-2 py-1 text-xs font-semibold text-accent-foreground">
          <meta.icon className="size-3.5" /> {meta.label}
        </span>
        <div className="flex flex-wrap justify-end gap-1">
          {demo && <DemoBadge />}
          <EvidenceBadge status={status} />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
      {(item.issuer || item.date) && (
        <p className="text-sm text-muted-foreground">{[item.issuer, item.date].filter(Boolean).join(" · ")}</p>
      )}
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
      {item.evidenceNote ? (
        <p className="mt-3 rounded-lg bg-teal-soft px-3 py-2 text-xs"><strong>Evidence:</strong> {item.evidenceNote}</p>
      ) : null}
      {item.skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.skills.map((s) => (
            <li key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{s}</li>
          ))}
        </ul>
      )}
      {(item.link || !demo) && (
        <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3">
          {item.link ? (
            <a href={item.link} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline">
              View <ExternalLink className="size-3.5" />
            </a>
          ) : <span />}
          {!demo && (
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" aria-label={`Edit ${item.title}`} onClick={onEdit}><Pencil /></Button>
              <Button size="icon" variant="ghost" aria-label={`Delete ${item.title}`} onClick={onDelete}><Trash2 /></Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ItemDialog({ draft, onClose }: { draft: Draft | null; onClose: () => void }) {
  return (
    <Dialog open={!!draft} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {draft && <ItemForm key={draft.id ?? "new"} initial={draft} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function ItemForm({ initial, onDone }: { initial: Draft; onDone: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((s) => ({ ...s, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!d.title.trim()) {
      toast.error("Please add a title.");
      return;
    }
    if (d.link && !/^https?:\/\//i.test(d.link.trim())) {
      toast.error("Links must start with http:// or https://");
      return;
    }
    const { id, createdAt, ...rest } = d;
    if (id && createdAt) {
      actions.updatePortfolioItem({ ...rest, id, createdAt });
      toast.success("Item updated.");
    } else {
      actions.addPortfolioItem(rest);
      toast.success("Item added to your portfolio.");
    }
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{d.id ? "Edit item" : "Add to your portfolio"}</DialogTitle>
        <DialogDescription>Without evidence this is labeled Self-Reported. Add a link or describe your evidence to show Evidence Provided.</DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <Label htmlFor="pf-type">Type</Label>
        <Select value={d.type} onValueChange={(v) => set("type", v as PortfolioType)}>
          <SelectTrigger id="pf-type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="work-sample">Work sample</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pf-title">Title *</Label>
        <Input id="pf-title" value={d.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. School solar panel installation" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pf-desc">Description</Label>
        <Textarea id="pf-desc" rows={3} value={d.description} onChange={(e) => set("description", e.target.value)} placeholder="What did you do? What was the result?" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pf-issuer">{d.type === "certificate" ? "Issued by" : "Client or organization"}</Label>
          <Input id="pf-issuer" value={d.issuer} onChange={(e) => set("issuer", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-date">Year</Label>
          <Input id="pf-date" value={d.date} onChange={(e) => set("date", e.target.value)} placeholder="2024" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pf-link">{d.type === "certificate" ? "Link from the issuer (optional)" : "Link (optional)"}</Label>
        <Input id="pf-link" type="url" value={d.link} onChange={(e) => set("link", e.target.value)} placeholder="https://" />
        <p className="text-xs text-muted-foreground">A link to a certificate, project, or work sample counts as evidence.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pf-evidence">Describe your evidence (optional)</Label>
        <Textarea id="pf-evidence" rows={2} value={d.evidenceNote ?? ""} onChange={(e) => set("evidenceNote", e.target.value)} placeholder="e.g. Certificate PDF I can share, photos of finished work, reference letter" />
        <p className="text-xs text-muted-foreground">Do not include ID numbers or immigration documents.</p>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
        <span>Label:</span>
        <EvidenceBadge status={itemHasEvidence({ link: d.link, evidenceNote: d.evidenceNote ?? "" }) ? "evidence-provided" : "self-reported"} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pf-skills">Skills this proves</Label>
        <TagInput id="pf-skills" value={d.skills} onChange={(v) => set("skills", v)} />
      </div>
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit">{d.id ? "Save changes" : "Add item"}</Button>
      </DialogFooter>
    </form>
  );
}
