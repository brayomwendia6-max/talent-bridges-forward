import type { Education, PortfolioItem } from "./types";

export type EvidenceStatus = "self-reported" | "evidence-provided" | "partner-verified";

/**
 * Partner Verified only comes from a record written by an authorized partner.
 * TalentBridge never creates one itself, and there is no in-app way to set it.
 */
export type PartnerVerification = { partner: string; checkedAt: string };

function hasPartner(v: PartnerVerification | undefined): boolean {
  return !!v && v.partner.trim().length > 0 && v.checkedAt.trim().length > 0;
}

export function itemHasEvidence(item: Pick<PortfolioItem, "link" | "evidenceNote">): boolean {
  return item.link.trim().length > 0 || (item.evidenceNote ?? "").trim().length > 0;
}

export function portfolioItemStatus(item: PortfolioItem): EvidenceStatus {
  if (hasPartner(item.partnerVerification)) return "partner-verified";
  return itemHasEvidence(item) ? "evidence-provided" : "self-reported";
}

export function educationStatus(ed: Education): EvidenceStatus {
  if (hasPartner(ed.partnerVerification)) return "partner-verified";
  return (ed.evidenceLink ?? "").trim().length > 0 ? "evidence-provided" : "self-reported";
}

/** A skill moves to Evidence Provided when a portfolio item with evidence lists it. */
export function skillStatus(skill: string, portfolio: PortfolioItem[]): EvidenceStatus {
  const key = skill.trim().toLowerCase();
  const linked = portfolio.filter((p) => p.skills.some((s) => s.trim().toLowerCase() === key));
  if (linked.some((p) => portfolioItemStatus(p) === "partner-verified")) return "partner-verified";
  return linked.some(itemHasEvidence) ? "evidence-provided" : "self-reported";
}
