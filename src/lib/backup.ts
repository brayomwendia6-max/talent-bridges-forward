import { z } from "zod";
import type { AppState } from "./types";

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const text = z.string().max(100_000);
const strings = z.array(text).max(1000);
const link = text.refine((value) => {
  if (!value.trim()) return true;
  try { return ["https:", "http:"].includes(new URL(value).protocol); }
  catch { return false; }
});
const education = z.object({
  id: text, school: text, qualification: text, year: text, evidenceLink: link.optional(),
});
const experience = z.object({
  id: text, role: text, organization: text, period: text, description: text,
});
// Only user-editable fields are accepted; imported files cannot confer partner verification.
const stateSchema = z.object({
  profile: z.object({
    name: text, headline: text, location: text, languages: text, background: text,
    education: z.array(education).max(1000), experience: z.array(experience).max(1000),
    skills: strings, updatedAt: text.nullable(),
  }),
  portfolio: z.array(z.object({
    id: text, type: z.enum(["project", "certificate", "work-sample"]),
    title: text, description: text, link, issuer: text, date: text, skills: strings,
    evidenceNote: text.optional(), createdAt: text,
  })).max(10_000),
  applications: z.array(z.object({
    id: text, opportunityId: text, opportunityTitle: text, organization: text,
    name: text, email: text, phone: text, message: text, portfolioLink: link, createdAt: text,
  })).max(10_000),
  mentorshipRequests: z.array(z.object({
    id: text, mentorId: text, mentorName: text, name: text, email: text,
    topic: text, goal: text, preferredContact: text, createdAt: text,
  })).max(10_000),
});
const backupSchema = z.object({
  app: z.literal("TalentBridge"), version: z.literal(1), exportedAt: text,
  data: stateSchema,
});

export function createBackup(state: AppState): string {
  const backup = JSON.stringify({
    app: "TalentBridge", version: 1, exportedAt: new Date().toISOString(),
    data: stateSchema.parse(state),
  }, null, 2);
  if (new TextEncoder().encode(backup).byteLength > MAX_BACKUP_BYTES) {
    throw new Error("This backup is too large. Please reduce your saved data and try again.");
  }
  return backup;
}

export function parseBackup(raw: string): AppState {
  if (new TextEncoder().encode(raw).byteLength > MAX_BACKUP_BYTES) {
    throw new Error("Please choose a backup smaller than 5 MB.");
  }
  try {
    const data = backupSchema.parse(JSON.parse(raw)).data;
    return {
      ...data,
      profile: {
        ...data.profile,
        education: data.profile.education.map(({ evidenceLink, ...entry }) =>
          evidenceLink === undefined ? entry : { ...entry, evidenceLink }),
      },
      portfolio: data.portfolio.map(({ evidenceNote, ...entry }) =>
        evidenceNote === undefined ? entry : { ...entry, evidenceNote }),
    };
  }
  catch { throw new Error("This is not a supported TalentBridge backup. Please choose a backup downloaded from TalentBridge."); }
}