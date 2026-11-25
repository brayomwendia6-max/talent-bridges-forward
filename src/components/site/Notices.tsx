import { BadgeCheck, Circle, FileCheck2, FlaskConical, HardDrive, ShieldAlert } from "lucide-react";
import type { EvidenceStatus } from "@/lib/evidence";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LocalStorageNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-teal/30 bg-teal-soft p-4 text-sm text-foreground",
        className,
      )}
    >
      <HardDrive className="mt-0.5 size-5 shrink-0 text-teal" />
      <p>
        <strong>Saved on this device only.</strong> Your information is stored in this browser's
        local storage. It is not uploaded anywhere. If you clear your browser data or use another
        device, it will not be there.
      </p>
    </div>
  );
}

export function PrivacyNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-demo-foreground/20 bg-demo p-4 text-sm text-demo-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-5 shrink-0" />
      <p>
        <strong>Do not enter sensitive documents.</strong> Never add ID numbers, passport details,
        refugee case numbers, or immigration papers. TalentBridge does not ask for them.
      </p>
    </div>
  );
}

export function DemoBadge({ className, label = "Demo data" }: { className?: string; label?: string }) {
  return (
    <Badge variant="demo" className={cn("gap-1", className)}>
      <FlaskConical className="size-3" />
      {label}
    </Badge>
  );
}

export function SelfReportedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="muted" className={cn("font-medium", className)} title="Entered by the user. Not checked by TalentBridge.">
      Self-reported
    </Badge>
  );
}

const EVIDENCE_META: Record<EvidenceStatus, { label: string; variant: "muted" | "teal" | "default"; icon: typeof Circle; title: string }> = {
  "self-reported": { label: "Self-Reported", variant: "muted", icon: Circle, title: "Entered by the user. No supporting evidence added yet." },
  "evidence-provided": { label: "Evidence Provided", variant: "teal", icon: FileCheck2, title: "The user added evidence such as a link, certificate, project, or work sample. TalentBridge has not checked it." },
  "partner-verified": { label: "Partner Verified", variant: "default", icon: BadgeCheck, title: "Independently checked and confirmed by an authorized partner." },
};

export function EvidenceBadge({ status, className }: { status: EvidenceStatus; className?: string }) {
  const m = EVIDENCE_META[status];
  return (
    <Badge variant={m.variant} className={cn("gap-1 font-medium", className)} title={m.title}>
      <m.icon className="size-3" />
      {m.label}
    </Badge>
  );
}

export function EvidenceLegend({ className }: { className?: string }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 shadow-card sm:p-6", className)} aria-labelledby="evidence-legend">
      <h2 id="evidence-legend" className="text-lg font-bold">What the evidence labels mean</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <dt><EvidenceBadge status="self-reported" /></dt>
          <dd className="text-sm text-muted-foreground">You entered this skill or qualification but have not added supporting evidence yet.</dd>
        </div>
        <div className="space-y-2">
          <dt><EvidenceBadge status="evidence-provided" /></dt>
          <dd className="text-sm text-muted-foreground">You added evidence such as a certificate link, project, portfolio item, or work sample. TalentBridge has not checked it.</dd>
        </div>
        <div className="space-y-2">
          <dt><EvidenceBadge status="partner-verified" /></dt>
          <dd className="text-sm text-muted-foreground">Only an authorized partner organization can give this label after checking it independently. TalentBridge does not do official verification, and this label is not available yet.</dd>
        </div>
      </dl>
    </section>
  );
}
