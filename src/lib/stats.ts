import { DEMO_BASELINE, OPPORTUNITIES } from "./demo-data";
import type { AppState, Profile } from "./types";

/** A profile counts as registered once the user has saved a name. */
export function isProfileRegistered(profile: Profile): boolean {
  return profile.name.trim().length > 0;
}

/** Share of the main profile sections that are filled in, 0–100. */
export function profileCompleteness(profile: Profile): number {
  const checks = [
    profile.name.trim().length > 0,
    profile.headline.trim().length > 0,
    profile.background.trim().length > 0,
    profile.education.length > 0,
    profile.experience.length > 0,
    profile.skills.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export type UserStats = {
  registeredProfiles: number;
  mentorshipRequests: number;
  applications: number;
  portfolioItems: number;
  completeness: number;
};

/** Real activity saved on this device only. Never mixed with demo numbers. */
export function computeUserStats(state: AppState): UserStats {
  return {
    registeredProfiles: isProfileRegistered(state.profile) ? 1 : 0,
    mentorshipRequests: state.mentorshipRequests.length,
    applications: state.applications.length,
    portfolioItems: state.portfolio.length,
    completeness: profileCompleteness(state.profile),
  };
}

/** Sample community numbers, always shown separately and labeled Demo Data. */
export const DEMO_STATS = {
  ...DEMO_BASELINE,
  listedOpportunities: OPPORTUNITIES.length,
} as const;
