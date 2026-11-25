import { describe, expect, it } from "vitest";
import { educationStatus, portfolioItemStatus, skillStatus } from "./evidence";
import type { PortfolioItem } from "./types";

const item = (p: Partial<PortfolioItem> = {}): PortfolioItem => ({
  id: "1", type: "project", title: "T", description: "", link: "", issuer: "", date: "",
  skills: ["SQL"], createdAt: "", ...p,
});

describe("evidence status", () => {
  it("is self-reported with no evidence", () => {
    expect(portfolioItemStatus(item())).toBe("self-reported");
    expect(skillStatus("SQL", [item()])).toBe("self-reported");
  });
  it("becomes evidence provided with a link or evidence note", () => {
    expect(portfolioItemStatus(item({ link: "https://x.org" }))).toBe("evidence-provided");
    expect(portfolioItemStatus(item({ evidenceNote: "Photos of finished work" }))).toBe("evidence-provided");
    expect(skillStatus("sql", [item({ link: "https://x.org" })])).toBe("evidence-provided");
  });
  it("never becomes partner verified from user evidence alone", () => {
    const strong = item({ link: "https://x.org", evidenceNote: "cert", issuer: "Uni" });
    expect(portfolioItemStatus(strong)).not.toBe("partner-verified");
    expect(educationStatus({ id: "e", school: "U", qualification: "BSc", year: "", evidenceLink: "https://x" })).toBe("evidence-provided");
  });
  it("is partner verified only with a partner record", () => {
    expect(portfolioItemStatus(item({ partnerVerification: { partner: "Org", checkedAt: "2026-01-01" } }))).toBe("partner-verified");
  });
});
