import { CourtType } from "./CourtType";

export interface Court {
  id: number | null;
  name: string;
  description: string;
  createdAt: string | null; 
  type: CourtType;
  placeId: number | null,
  userId: number;
}