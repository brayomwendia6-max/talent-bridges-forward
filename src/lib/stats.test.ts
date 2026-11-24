import { describe, expect, it } from "vitest";
import { DEMO_BASELINE, OPPORTUNITIES } from "./demo-data";
import { computeStats, profileCompleteness } from "./stats";
import { EMPTY_PROFILE, EMPTY_STATE } from "./store";
import type { AppState } from "./types";

describe("dashboard stats", () => {
  it("shows demo starting numbers when nothing is saved", () => {
    const s = computeStats(EMPTY_STATE);
    expect(s.registeredProfiles).toBe(248);
    expect(s.mentorshipRequests).toBe(87);
    expect(s.listedOpportunities).toBe(OPPORTUNITIES.length);
  });

  it("adds one registered profile once the user saves a name", () => {
    const state: AppState = { ...EMPTY_STATE, profile: { ...EMPTY_PROFILE, name: "Amal" } };
    expect(computeStats(state).registeredProfiles).toBe(DEMO_BASELINE.registeredProfiles + 1);
  });

  it("counts each mentorship request, application and portfolio item", () => {
    const state = {
      ...EMPTY_STATE,
      mentorshipRequests: [{}, {}],
      applications: [{}, {}, {}],
      portfolio: [{}],
    } as unknown as AppState;
    const s = computeStats(state);
    expect(s.mentorshipRequests).toBe(DEMO_BASELINE.mentorshipRequests + 2);
    expect(s.applications).toBe(DEMO_BASELINE.applications + 3);
    expect(s.portfolioItems).toBe(DEMO_BASELINE.portfolioItems + 1);
  });

  it("rates profile completeness across six sections", () => {
    expect(profileCompleteness(EMPTY_PROFILE)).toBe(0);
    expect(profileCompleteness({ ...EMPTY_PROFILE, name: "A", headline: "B", skills: ["C"] })).toBe(50);
  });
});

import { filterOpportunities } from "./filter";

describe("opportunity filters", () => {
  it("filters by category", () => {
    const r = filterOpportunities(OPPORTUNITIES, { query: "", category: "Training", skill: "all" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((o) => o.category === "Training")).toBe(true);
  });
  it("filters by skill and search text together", () => {
    const r = filterOpportunities(OPPORTUNITIES, { query: "excel", category: "all", skill: "Accounting" });
    expect(r.map((o) => o.id)).toEqual(["op-6"]);
  });
});
