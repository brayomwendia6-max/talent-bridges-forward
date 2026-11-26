import { useRef, useState, type ChangeEvent } from "react";
import { Download, Upload, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { createBackup, MAX_BACKUP_BYTES, parseBackup } from "@/lib/backup";
import { actions, useAppState } from "@/lib/store";
import type { AppState } from "@/lib/types";

export function BackupRestore({ profilePage = false }: { profilePage?: boolean }) {
  const state = useAppState();
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<AppState | null>(null);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");

  function download() {
    setError("");
    try {
      const url = URL.createObjectURL(new Blob([createBackup(state)], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `talentbridge-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("We could not create a backup. Check your saved information and try again.");
    }
  }

  async function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error("Please choose a backup smaller than 5 MB.");
      setPending(parseBackup(await file.text()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not read this backup. Please try another file.");
    } finally { setReading(false); }
  }

  return (
    <section aria-label="Backup and restore" className="border-y py-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="size-5 text-teal" /> Backup & restore</h2>
          <p className="mt-2 text-sm text-muted-foreground">Keep a copy of your saved profile, portfolio, applications, and mentorship requests. Your backup stays with you, not on our servers.</p>
          {profilePage && <p className="mt-2 text-sm text-muted-foreground">Save your profile before downloading. Unsaved changes are not included.</p>}
          <p className="mt-2 text-xs text-muted-foreground">The file contains personal information. Keep it private. Evidence links and notes are included; linked files and partner verification are not.</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={download}><Download /> Download backup</Button>
          <Button type="button" variant="outline" disabled={reading} onClick={() => input.current?.click()}><Upload /> {reading ? "Reading backup…" : "Restore from backup"}</Button>
          <input ref={input} type="file" accept=".json,application/json" aria-label="Choose TalentBridge backup" className="hidden" onChange={(event) => { void chooseFile(event); }} />
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <AlertDialog open={pending !== null} onOpenChange={(open) => { if (!open) setPending(null); }}>
        <AlertDialogContent className="max-h-[90dvh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Replace your data with this backup?</AlertDialogTitle>
            <AlertDialogDescription>This replaces all saved information on this device, including any unsaved profile changes. Download your current backup first if you want to keep it. Nothing is sent to employers or mentors.</AlertDialogDescription>
          </AlertDialogHeader>
          {pending && <div className="space-y-2 text-sm">
            <p className="break-words font-semibold">{pending.profile.name || "Unnamed profile"}</p>
            <p>{pending.portfolio.length} portfolio items · {pending.applications.length} applications · {pending.mentorshipRequests.length} mentorship requests</p>
          </div>}
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my current data</AlertDialogCancel>
            <AlertDialogAction onClick={(event) => {
              event.preventDefault();
              if (!pending) return;
              try {
                actions.restoreBackup(pending);
                setPending(null);
                toast.success("Backup restored and saved on this device.");
              } catch {
                setPending(null);
                setError("Your browser could not save the backup. Your current data has not changed. Free some storage or allow browser storage, then try again.");
              }
            }}>Replace and restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}