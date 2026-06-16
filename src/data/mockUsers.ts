import type { User } from "../types/user";

export interface MockUser extends User {
  passwordHash: string; // Plain password for frontend mock matching
}

export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    name: "Elena Rostova",
    email: "elena@blogmind.ai",
    passwordHash: "password123"
  },
  {
    id: "user-2",
    name: "Milan Kovačić",
    email: "admin@blogmind.ai",
    passwordHash: "password123"
  },
  {
    id: "user-3",
    name: "Demo Writer",
    email: "demo@blogmind.ai",
    passwordHash: "demo123"
  }
];
