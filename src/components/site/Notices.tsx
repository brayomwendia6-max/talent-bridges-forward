import { FlaskConical, HardDrive, ShieldAlert } from "lucide-react";
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
