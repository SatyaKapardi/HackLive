// Simple types for the application - no external dependencies
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface Hackathon {
  id: number;
  name: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  location: string;
  format: string;
  description: string;
  prizePool?: number;
  registrationDeadline?: string;
  status: string;
  tags: string[];
  experienceLevel: string;
  imageUrl?: string;
  websiteUrl?: string;
  createdAt?: Date;
}

export interface InsertHackathon {
  name: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  location: string;
  format: string;
  description: string;
  prizePool?: number;
  registrationDeadline?: string;
  status?: string;
  tags: string[];
  experienceLevel: string;
  imageUrl?: string;
  websiteUrl?: string;
}
