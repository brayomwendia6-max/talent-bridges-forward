import { describe, expect, it, vi } from "vitest";
import { createBackup, MAX_BACKUP_BYTES, parseBackup } from "./backup";
import { actions, EMPTY_STATE, STORAGE_KEY } from "./store";
import { portfolioItemStatus, educationStatus } from "./evidence";
import type { AppState } from "./types";

const state: AppState = {
  profile: { ...EMPTY_STATE.profile, name: "Amal", skills: ["SQL"], education: [
    { id: "e", school: "University", qualification: "BSc", year: "2020", evidenceLink: "https://example.org/cert" },
  ] },
  portfolio: [{ id: "p", title: "Work", type: "project", description: "Sample", link: "https://example.org/work", issuer: "", date: "", skills: ["SQL"], evidenceNote: "Work sample", createdAt: "2026-11-26" }],
  applications: [{ id: "a", opportunityId: "o", opportunityTitle: "Job", organization: "Org", name: "Amal", email: "a@example.org", phone: "", message: "Hi", portfolioLink: "", createdAt: "2026-11-26" }],
  mentorshipRequests: [{ id: "r", mentorId: "m", mentorName: "Mentor", name: "Amal", email: "a@example.org", topic: "Career", goal: "Learn", preferredContact: "Email", createdAt: "2026-11-26" }],
};

describe("TalentBridge backups", () => {
  it("round-trips all user data and evidence without adding demo rows", () => {
    expect(parseBackup(createBackup(state))).toEqual(state);
  });
  it("rejects malformed and incomplete files", () => {
    for (const raw of ["bad json", "{}", JSON.stringify({ app: "TalentBridge", version: 1, data: { profile: {} } })]) {
      expect(() => parseBackup(raw)).toThrow("not a supported");
    }
  });
  it("rejects unsupported versions", () => {
    const backup = JSON.parse(createBackup(state));
    backup.version = 2;
    expect(() => parseBackup(JSON.stringify(backup))).toThrow("not a supported");
  });
  it("rejects backups larger than 5 MB", () => {
    expect(MAX_BACKUP_BYTES).toBe(5 * 1024 * 1024);
    expect(() => parseBackup("x".repeat(MAX_BACKUP_BYTES + 1))).toThrow("smaller than 5 MB");
  });
  it("never grants Partner Verified from an imported file", () => {
    const backup = JSON.parse(createBackup(state));
    backup.data.portfolio[0].partnerVerification = { partner: "Forged", checkedAt: "2026-11-26" };
    backup.data.profile.education[0].partnerVerification = { partner: "Forged", checkedAt: "2026-11-26" };
    const restored = parseBackup(JSON.stringify(backup));
    const item = restored.portfolio[0];
    const ed = restored.profile.education[0];
    if (!item || !ed) throw new Error("Missing restored evidence");
    expect(portfolioItemStatus(item)).toBe("evidence-provided");
    expect(educationStatus(ed)).toBe("evidence-provided");
  });
  it("rejects unsafe evidence links", () => {
    const backup = JSON.parse(createBackup(state));
    backup.data.portfolio[0].link = "javascript:alert(1)";
    expect(() => parseBackup(JSON.stringify(backup))).toThrow("not a supported");
  });
  it("replaces saved device data rather than duplicating it", () => {
    actions.restoreBackup(EMPTY_STATE);
    actions.restoreBackup(state);
    actions.restoreBackup(state);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual(state);
  });
  it("preserves saved data when storage refuses a restore", () => {
    actions.restoreBackup(state);
    const mock = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Full"); });
    try {
      expect(() => actions.restoreBackup(EMPTY_STATE)).toThrow("Full");
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual(state);
    } finally { mock.mockRestore(); }
  });
});