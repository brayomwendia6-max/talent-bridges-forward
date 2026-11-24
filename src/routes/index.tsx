import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  FolderKanban,
  HardDrive,
  HeartHandshake,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/site/Notices";
import { computeStats } from "@/lib/stats";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentBridge – Skills to Opportunities" },
      {
        name: "description",
        content:
          "Skilled refugees often can't find work that matches their abilities. TalentBridge helps you build a profile, show your work, meet mentors, and find opportunities.",
      },
      { property: "og:title", content: "TalentBridge – Skills to Opportunities" },
      {
        property: "og:description",
        content:
          "Build a profile, show your work, meet mentors, and find internships, remote jobs, fellowships, and training.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    icon: UserRound,
    title: "Create your profile",
    text: "Add your background, education, work experience, and skills.",
    to: "/profile",
  },
  {
    icon: FolderKanban,
    title: "Show your work",
    text: "Add projects, certificates, and examples that prove what you can do.",
    to: "/portfolio",
  },
  {
    icon: BriefcaseBusiness,
    title: "Find opportunities",
    text: "Search internships, remote jobs, fellowships, and training.",
    to: "/opportunities",
  },
  {
    icon: HeartHandshake,
    title: "Get a mentor",
    text: "Ask experienced professionals for advice and support.",
    to: "/mentorship",
  },
] as const;

function Home() {
  const state = useAppState();
  const stats = computeStats(state);

  return (
    <>
      <section className="relative overflow-hidden bg-hero text-navy-foreground">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-32 sm:px-6 md:grid-cols-[1.15fr_1fr] md:pb-28 md:pt-40">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3 py-1 text-sm text-navy-foreground/80">
              <span className="size-2 rounded-full bg-teal-bright" /> Skills to Opportunities
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Your skills came with you.
              <span className="block text-teal-bright">Let's put them to work.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-navy-foreground/80">
              Many refugees are trained nurses, engineers, teachers, and developers. Yet they
              struggle to find jobs that match their skills. TalentBridge helps you show what you
              can do and connect with people and opportunities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" variant="secondary">
                <Link to="/profile">
                  Get Started <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="onDark">
                <Link to="/opportunities">Browse opportunities</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-6 backdrop-blur sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-navy-foreground/80">Community so far</p>
              <DemoBadge label="Includes demo numbers" />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {[
                { label: "Registered profiles", value: stats.registeredProfiles },
                { label: "Listed opportunities", value: stats.listedOpportunities },
                { label: "Mentorship requests", value: stats.mentorshipRequests },
                { label: "Applications sent", value: stats.applications },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-navy-deep/60 p-4">
                  <dd className="font-display text-3xl font-bold text-teal-bright">{s.value}</dd>
                  <dt className="mt-1 text-sm text-navy-foreground/70">{s.label}</dt>
                </div>
              ))}
            </dl>
            <Link
              to="/dashboard"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-bright hover:underline"
            >
              See the dashboard <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">The problem</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Talent is everywhere. Access is not.</h2>
          </div>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              When people are forced to leave home, they often lose their papers, their networks,
              and the chance to prove their experience. Employers may not recognize foreign
              qualifications. Many skilled people end up in jobs far below their ability.
            </p>
            <p>
              TalentBridge gives you a simple place to describe your skills, collect examples of
              your work, and reach mentors and opportunities — in clear, simple English.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">How it works</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Four simple steps</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <Link
                  to={step.to}
                  className="group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-teal-soft text-teal">
                      <step.icon className="size-5" />
                    </span>
                    <span className="font-display text-3xl font-bold text-border">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{step.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
                    Go <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border p-6 sm:p-8">
            <HardDrive className="size-6 text-teal" />
            <h3 className="mt-4 text-xl font-bold">Your data stays on your device</h3>
            <p className="mt-2 text-muted-foreground">
              There is no account and no sign-up. Everything you type is saved in this browser
              only, so it is still there when you come back on the same device.
            </p>
          </div>
          <div className="rounded-2xl border p-6 sm:p-8">
            <p className="font-display text-xl font-bold">What we don't do</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>We do not verify qualifications, refugee status, or work permits.</li>
              <li>We never ask for ID numbers or immigration documents.</li>
              <li>Sample opportunities and mentors are demo data for this preview.</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-hero px-6 py-12 text-center text-navy-foreground">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to show what you can do?</h2>
          <Button asChild size="xl" variant="secondary">
            <Link to="/profile">
              Get Started <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
