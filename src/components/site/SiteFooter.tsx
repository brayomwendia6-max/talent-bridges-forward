import { HardDrive } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">TalentBridge</p>
          <p className="mt-2 text-sm text-navy-foreground/70">
            Helping skilled refugees show their abilities, meet mentors, and find work.
          </p>
        </div>
        <div className="text-sm text-navy-foreground/70">
          <p className="flex items-center gap-2 font-semibold text-navy-foreground">
            <HardDrive className="size-4 text-teal-bright" /> Your data stays on this device
          </p>
          <p className="mt-2">
            Everything you enter is saved in this browser only. Nothing is sent to a server.
          </p>
        </div>
        <div className="text-sm text-navy-foreground/70">
          <p className="font-semibold text-navy-foreground">Please note</p>
          <p className="mt-2">
            TalentBridge does not verify qualifications, refugee status, or work permits. Sample
            opportunities and mentors are demo data.
          </p>
        </div>
      </div>
    </footer>
  );
}
