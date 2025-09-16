import { Court } from "./Court";

// en OUT, on met à null les champs qui ne sont pas un form
export interface Place {
  id: number | null;
  name: string;
  address: string;
  createdAt: string | null; // ISO date string
  courts: Court[] | null
  userId: number;
}