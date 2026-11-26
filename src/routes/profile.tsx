import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { GraduationCap, Plus, Save, Trash2, BriefcaseBusiness, ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/site/PageHeader";
import { BackupRestore } from "@/components/site/BackupRestore";
import { EvidenceBadge, EvidenceLegend, LocalStorageNotice, PrivacyNotice } from "@/components/site/Notices";
import { educationStatus, skillStatus } from "@/lib/evidence";
import { TagInput } from "@/components/site/TagInput";
import { actions, newId, useAppState } from "@/lib/store";
import { profileCompleteness } from "@/lib/stats";
import type { PortfolioItem, Profile } from "@/lib/types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile – TalentBridge" },
      {
        name: "description",
        content: "Add your name, professional background, education, work experience, and skills.",
      },
      { property: "og:title", content: "My Profile – TalentBridge" },
      {
        property: "og:description",
        content: "Build a simple professional profile that shows employers and mentors what you can do.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const hydrated = useHydrated();
  const state = useAppState();

  return (
    <>
      <PageHeader
        eyebrow="Step 1"
        title="My Profile"
        description="Tell employers and mentors who you are and what you can do. Fill in what you can — you can come back and edit any time."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <LocalStorageNotice />
          <PrivacyNotice />
        </div>
        {hydrated ? (
          <>
            <EvidenceLegend className="mt-6" />
            <div className="mt-6"><BackupRestore profilePage /></div>
            <ProfileForm key={JSON.stringify(state.profile)} initial={state.profile} portfolio={state.portfolio} />
          </>
        ) : (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}
      </div>
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-7">
      <h2 className="text-xl font-bold">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ProfileForm({ initial, portfolio }: { initial: Profile; portfolio: PortfolioItem[] }) {
  const [p, setP] = useState<Profile>(initial);
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setP((s) => ({ ...s, [key]: value }));
  const completeness = profileCompleteness(p);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!p.name.trim()) {
      toast.error("Please enter your name before saving.");
      document.getElementById("name")?.focus();
      return;
    }
    actions.saveProfile({
      ...p,
      education: p.education.filter((x) => x.school.trim() || x.qualification.trim()),
      experience: p.experience.filter((x) => x.role.trim() || x.organization.trim()),
    });
    toast.success("Profile saved on this device.");
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Section title="About you" description="Your name and a short summary of your work.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Amal Hassan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Job title or profession</Label>
              <Input id="headline" value={p.headline} onChange={(e) => set("headline", e.target.value)} placeholder="e.g. Civil Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City or region (optional)</Label>
              <Input id="location" value={p.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Nairobi, Kenya" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="languages">Languages you speak</Label>
              <Input id="languages" value={p.languages} onChange={(e) => set("languages", e.target.value)} placeholder="e.g. Arabic, English, French" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="background">Professional background</Label>
            <Textarea
              id="background"
              rows={5}
              value={p.background}
              onChange={(e) => set("background", e.target.value)}
              placeholder="Describe your work, what you are good at, and the kind of job you want."
            />
          </div>
        </Section>

        <Section title="Education" description="Schools, universities, or training you completed.">
          <div className="space-y-4">
            {p.education.map((ed, i) => (
              <div key={ed.id} className="grid gap-3 rounded-xl border bg-muted/50 p-4 sm:grid-cols-[1fr_1fr_110px_auto] sm:items-end">
                <div className="space-y-1.5">
                  <Label htmlFor={`ed-school-${ed.id}`}>School or university</Label>
                  <Input id={`ed-school-${ed.id}`} value={ed.school} onChange={(e) => set("education", p.education.map((x, j) => (j === i ? { ...x, school: e.target.value } : x)))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`ed-q-${ed.id}`}>Qualification</Label>
                  <Input id={`ed-q-${ed.id}`} value={ed.qualification} placeholder="e.g. BSc Nursing" onChange={(e) => set("education", p.education.map((x, j) => (j === i ? { ...x, qualification: e.target.value } : x)))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`ed-y-${ed.id}`}>Year</Label>
                  <Input id={`ed-y-${ed.id}`} value={ed.year} placeholder="2018" onChange={(e) => set("education", p.education.map((x, j) => (j === i ? { ...x, year: e.target.value } : x)))} />
                </div>
                <Button type="button" variant="ghost" size="icon" aria-label="Remove education" onClick={() => set("education", p.education.filter((x) => x.id !== ed.id))}>
                  <Trash2 />
                </Button>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label htmlFor={`ed-ev-${ed.id}`}>Evidence link (optional)</Label>
                  <Input id={`ed-ev-${ed.id}`} type="url" value={ed.evidenceLink ?? ""} placeholder="https:// link to your certificate or transcript" onChange={(e) => set("education", p.education.map((x, j) => (j === i ? { ...x, evidenceLink: e.target.value } : x)))} />
                </div>
                <div className="sm:pb-2"><EvidenceBadge status={educationStatus(ed)} /></div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => set("education", [...p.education, { id: newId(), school: "", qualification: "", year: "" }])}>
              <Plus /> Add education
            </Button>
          </div>
        </Section>

        <Section title="Work experience" description="Jobs, volunteering, or your own business — in any country.">
          <div className="space-y-4">
            {p.experience.map((ex, i) => {
              const upd = (patch: Partial<typeof ex>) =>
                set("experience", p.experience.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              return (
                <div key={ex.id} className="space-y-3 rounded-xl border bg-muted/50 p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`ex-r-${ex.id}`}>Role</Label>
                      <Input id={`ex-r-${ex.id}`} value={ex.role} placeholder="e.g. Site Engineer" onChange={(e) => upd({ role: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`ex-o-${ex.id}`}>Organization</Label>
                      <Input id={`ex-o-${ex.id}`} value={ex.organization} onChange={(e) => upd({ organization: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`ex-p-${ex.id}`}>When</Label>
                      <Input id={`ex-p-${ex.id}`} value={ex.period} placeholder="2015 – 2020" onChange={(e) => upd({ period: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`ex-d-${ex.id}`}>What you did</Label>
                    <Textarea id={`ex-d-${ex.id}`} rows={3} value={ex.description} onChange={(e) => upd({ description: e.target.value })} />
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => set("experience", p.experience.filter((x) => x.id !== ex.id))}>
                    <Trash2 /> Remove
                  </Button>
                </div>
              );
            })}
            <Button type="button" variant="outline" onClick={() => set("experience", [...p.experience, { id: newId(), role: "", organization: "", period: "", description: "" }])}>
              <Plus /> Add work experience
            </Button>
          </div>
        </Section>

        <Section title="Skills" description="Add skills one at a time. Skills you add here are shown as self-reported.">
          <TagInput id="skills" value={p.skills} onChange={(v) => set("skills", v)} placeholder="e.g. Project Management, then press Enter" />
          {p.skills.length > 0 && (
            <ul className="mt-4 space-y-2">
              {p.skills.map((s) => {
                const st = skillStatus(s, portfolio);
                return (
                  <li key={s} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2.5 text-sm">
                    <span className="font-medium">{s}</span>
                    <span className="flex items-center gap-2">
                      <EvidenceBadge status={st} />
                      {st === "self-reported" && (
                        <Link to="/portfolio" className="text-xs font-semibold text-teal hover:underline">Add evidence</Link>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">To add evidence for a skill, add a portfolio item with a link or evidence note and list the skill on it.</p>
        </Section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Profile complete</span>
              <span className="font-display text-lg font-bold text-teal">{completeness}%</span>
            </div>
            <Progress value={completeness} className="mt-2" />
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-display text-lg font-bold">{p.name || "Your name"}</p>
            <p className="text-muted-foreground">{p.headline || "Your profession"}</p>
            <p className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="size-4" /> {p.education.length} education</p>
            <p className="flex items-center gap-2 text-muted-foreground"><BriefcaseBusiness className="size-4" /> {p.experience.length} work experience</p>
            {p.skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <EvidenceBadge status="self-reported" />
                <span className="text-xs text-muted-foreground">{p.skills.length} skills</span>
              </div>
            )}
          </div>
          <Button type="submit" size="lg" className="w-full">
            <Save /> Save profile
          </Button>
          {initial.updatedAt && (
            <p className="text-center text-xs text-muted-foreground">
              Last saved {new Date(initial.updatedAt).toLocaleString()}
            </p>
          )}
          <Link to="/portfolio" className="flex items-center justify-center gap-1 text-sm font-semibold text-teal hover:underline">
            Next: add your work <ArrowRight className="size-4" />
          </Link>
        </div>
      </aside>
    </form>
  );
}
