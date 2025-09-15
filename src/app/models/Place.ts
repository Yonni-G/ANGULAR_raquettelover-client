export interface Place {
  id: number | null;
  name: string;
  address: string;
  createdAt: string | null; // ISO date string
  userId: number;
}