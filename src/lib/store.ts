import { useSyncExternalStore } from "react";
import type {
  AppState,
  Application,
  MentorshipRequest,
  PortfolioItem,
  Profile,
} from "./types";

export const STORAGE_KEY = "talentbridge:v1";

export const EMPTY_PROFILE: Profile = {
  name: "",
  headline: "",
  location: "",
  languages: "",
  background: "",
  education: [],
  experience: [],
  skills: [],
  updatedAt: null,
};

export const EMPTY_STATE: AppState = {
  profile: EMPTY_PROFILE,
  portfolio: [],
  applications: [],
  mentorshipRequests: [],
};

let cache: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      profile: { ...EMPTY_PROFILE, ...(parsed.profile ?? {}) },
      portfolio: parsed.portfolio ?? [],
      applications: parsed.applications ?? [],
      mentorshipRequests: parsed.mentorshipRequests ?? [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

function getSnapshot(): AppState {
  if (!cache) cache = load();
  return cache;
}

function getServerSnapshot(): AppState {
  return EMPTY_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(fn: (s: AppState) => AppState) {
  const next = fn(getSnapshot());
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep in memory for this visit */
  }
  listeners.forEach((l) => l());
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const actions = {
  saveProfile(profile: Profile) {
    update((s) => ({ ...s, profile: { ...profile, updatedAt: new Date().toISOString() } }));
  },
  addPortfolioItem(item: Omit<PortfolioItem, "id" | "createdAt">) {
    update((s) => ({
      ...s,
      portfolio: [{ ...item, id: newId(), createdAt: new Date().toISOString() }, ...s.portfolio],
    }));
  },
  updatePortfolioItem(item: PortfolioItem) {
    update((s) => ({ ...s, portfolio: s.portfolio.map((p) => (p.id === item.id ? item : p)) }));
  },
  removePortfolioItem(id: string) {
    update((s) => ({ ...s, portfolio: s.portfolio.filter((p) => p.id !== id) }));
  },
  addApplication(app: Omit<Application, "id" | "createdAt">) {
    update((s) => ({
      ...s,
      applications: [{ ...app, id: newId(), createdAt: new Date().toISOString() }, ...s.applications],
    }));
  },
  removeApplication(id: string) {
    update((s) => ({ ...s, applications: s.applications.filter((a) => a.id !== id) }));
  },
  addMentorshipRequest(req: Omit<MentorshipRequest, "id" | "createdAt">) {
    update((s) => ({
      ...s,
      mentorshipRequests: [
        { ...req, id: newId(), createdAt: new Date().toISOString() },
        ...s.mentorshipRequests,
      ],
    }));
  },
  removeMentorshipRequest(id: string) {
    update((s) => ({
      ...s,
      mentorshipRequests: s.mentorshipRequests.filter((r) => r.id !== id),
    }));
  },
  clearAll() {
    update(() => EMPTY_STATE);
  },
};
