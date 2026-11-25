import type { PartnerVerification } from "./evidence";

export type Education = { id: string; school: string; qualification: string; year: string;
  evidenceLink?: string;
  partnerVerification?: PartnerVerification;
};
export type Experience = {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
};

export type Profile = {
  name: string;
  headline: string;
  location: string;
  languages: string;
  background: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  updatedAt: string | null;
};

export type PortfolioType = "project" | "certificate" | "work-sample";

export type PortfolioItem = {
  id: string;
  type: PortfolioType;
  title: string;
  description: string;
  link: string;
  issuer: string;
  date: string;
  skills: string[];
  evidenceNote?: string;
  partnerVerification?: PartnerVerification;
  createdAt: string;
};

export type OpportunityCategory = "Internship" | "Remote Job" | "Fellowship" | "Training";

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  location: string;
  duration: string;
  pay: string;
  deadline: string;
  skills: string[];
  description: string;
};

export type Application = {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organization: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  portfolioLink: string;
  createdAt: string;
};

export type Mentor = {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  expertise: string[];
  languages: string[];
  bio: string;
  availability: string;
};

export type MentorshipRequest = {
  id: string;
  mentorId: string;
  mentorName: string;
  name: string;
  email: string;
  topic: string;
  goal: string;
  preferredContact: string;
  createdAt: string;
};

export type AppState = {
  profile: Profile;
  portfolio: PortfolioItem[];
  applications: Application[];
  mentorshipRequests: MentorshipRequest[];
};
