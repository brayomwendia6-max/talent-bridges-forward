import type { Opportunity } from "./types";

export function filterOpportunities(
  list: Opportunity[],
  { query, category, skill }: { query: string; category: string; skill: string },
): Opportunity[] {
  const q = query.trim().toLowerCase();
  return list.filter((o) => {
    if (category !== "all" && o.category !== category) return false;
    if (skill !== "all" && !o.skills.includes(skill)) return false;
    if (!q) return true;
    return [o.title, o.organization, o.location, o.description, ...o.skills]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}
