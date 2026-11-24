import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { BriefcaseBusiness, FolderKanban, HeartHandshake, Send, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/site/PageHeader";
import { DemoBadge, LocalStorageNotice } from "@/components/site/Notices";
import { DEMO_BASELINE } from "@/lib/demo-data";
import { computeStats, isProfileRegistered } from "@/lib/stats";
import { actions, EMPTY_STATE, useAppState } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard – TalentBridge" },
      { name: "description", content: "See registered profiles, listed opportunities, applications, and mentorship requests." },
      { property: "og:title", content: "Dashboard – TalentBridge" },
      { property: "og:description", content: "Live numbers for profiles, opportunities, applications, and mentorship requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const hydrated = useHydrated();
  const live = useAppState();
  const state = hydrated ? live : EMPTY_STATE;
  const stats = computeStats(state);
  const registered = isProfileRegistered(state.profile);

  const cards = [
    { label: "Registered profiles", value: stats.registeredProfiles, demo: DEMO_BASELINE.registeredProfiles, mine: registered ? 1 : 0, icon: Users, to: "/profile" as const },
    { label: "Listed opportunities", value: stats.listedOpportunities, demo: stats.listedOpportunities, mine: 0, icon: BriefcaseBusiness, to: "/opportunities" as const },
    { label: "Mentorship requests", value: stats.mentorshipRequests, demo: DEMO_BASELINE.mentorshipRequests, mine: state.mentorshipRequests.length, icon: HeartHandshake, to: "/mentorship" as const },
    { label: "Applications sent", value: stats.applications, demo: DEMO_BASELINE.applications, mine: state.applications.length, icon: Send, to: "/opportunities" as const },
    { label: "Portfolio items", value: stats.portfolioItems, demo: DEMO_BASELINE.portfolioItems, mine: state.portfolio.length, icon: FolderKanban, to: "/portfolio" as const },
  ];

  const activity = [
    ...state.applications.map((a) => ({ id: a.id, at: a.createdAt, text: `Applied to ${a.opportunityTitle}` })),
    ...state.mentorshipRequests.map((r) => ({ id: r.id, at: r.createdAt, text: `Requested mentorship from ${r.mentorName}` })),
    ...state.portfolio.map((p) => ({ id: p.id, at: p.createdAt, text: `Added "${p.title}" to portfolio` })),
    ...(state.profile.updatedAt ? [{ id: "profile", at: state.profile.updatedAt, text: "Updated your profile" }] : []),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="These numbers update as you add profile information, projects, applications, and mentorship requests."
      >
        <DemoBadge label="Starting numbers are demo data" className="text-sm" />
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <Link key={c.label} to={c.to} className="group rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid size-10 place-items-center rounded-lg bg-teal-soft text-teal"><c.icon className="size-5" /></span>
              <p className="mt-4 font-display text-4xl font-bold tabular-nums" data-testid={`stat-${c.label}`}>{c.value}</p>
              <p className="mt-1 text-sm font-semibold">{c.label}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {c.mine > 0 ? <><span className="font-semibold text-teal">+{c.mine} from you</span> · {c.demo} demo</> : <>{c.demo} demo</>}
              </p>
            </Link>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <section className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Your progress</h2>
            <div className="mt-5">
              <div className="flex justify-between text-sm"><span>Profile complete</span><span className="font-bold text-teal">{stats.completeness}%</span></div>
              <Progress value={stats.completeness} className="mt-2" />
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              <ProgressRow done={registered} label="Create your profile" to="/profile" />
              <ProgressRow done={state.portfolio.length > 0} label="Add a portfolio item" to="/portfolio" />
              <ProgressRow done={state.applications.length > 0} label="Apply for an opportunity" to="/opportunities" />
              <ProgressRow done={state.mentorshipRequests.length > 0} label="Request a mentor" to="/mentorship" />
            </ul>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Recent activity on this device</h2>
            {activity.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Nothing yet. <Link to="/profile" className="font-semibold text-teal underline">Start with your profile</Link>.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" />
                    <div>
                      <p>{a.text}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="space-y-4">
          <LocalStorageNotice />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline"><Trash2 /> Delete all my data from this device</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all your data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes your profile, portfolio, applications, and mentorship requests from this browser. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my data</AlertDialogCancel>
                <AlertDialogAction onClick={() => { actions.clearAll(); toast.success("Your data was deleted from this device."); }}>
                  Delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </>
  );
}

function ProgressRow({ done, label, to }: { done: boolean; label: string; to: "/profile" | "/portfolio" | "/opportunities" | "/mentorship" }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <span className="flex items-center gap-3">
        <span className={done ? "grid size-6 place-items-center rounded-full bg-teal text-xs font-bold text-secondary-foreground" : "size-6 rounded-full border-2"}>
          {done ? "✓" : null}
        </span>
        <span className={done ? "text-muted-foreground line-through" : "font-medium"}>{label}</span>
      </span>
      {!done && <Link to={to} className="text-sm font-semibold text-teal hover:underline">Go</Link>}
    </li>
  );
}
