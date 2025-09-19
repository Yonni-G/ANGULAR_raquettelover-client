import { Court } from "./Court";

// en OUT, on met à null les champs qui ne sont pas dans le form
export interface Place {
  id: number | null;
  codeLieu: string,
  name: string;
  address: string;
  createdAt: string | null; // ISO date string
  courts: Court[] | null
  userId: number;
}