import { describe, expect, it } from "vitest";
import { OPPORTUNITIES } from "./demo-data";
import { computeUserStats, DEMO_STATS, profileCompleteness } from "./stats";
import { EMPTY_PROFILE, EMPTY_STATE } from "./store";
import type { AppState } from "./types";

describe("dashboard stats", () => {
  it("shows zero user activity when nothing is saved", () => {
    const s = computeUserStats(EMPTY_STATE);
    expect(s).toMatchObject({ registeredProfiles: 0, mentorshipRequests: 0, applications: 0, portfolioItems: 0 });
  });

  it("keeps demo numbers separate and fixed", () => {
    expect(DEMO_STATS.registeredProfiles).toBe(248);
    expect(DEMO_STATS.mentorshipRequests).toBe(87);
    expect(DEMO_STATS.listedOpportunities).toBe(OPPORTUNITIES.length);
  });

  it("counts one registered profile once the user saves a name", () => {
    const state: AppState = { ...EMPTY_STATE, profile: { ...EMPTY_PROFILE, name: "Amal" } };
    expect(computeUserStats(state).registeredProfiles).toBe(1);
  });

  it("counts each real mentorship request, application and portfolio item without demo figures", () => {
    const state = {
      ...EMPTY_STATE,
      mentorshipRequests: [{}, {}],
      applications: [{}, {}, {}],
      portfolio: [{}],
    } as unknown as AppState;
    const s = computeUserStats(state);
    expect(s.mentorshipRequests).toBe(2);
    expect(s.applications).toBe(3);
    expect(s.portfolioItems).toBe(1);
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
