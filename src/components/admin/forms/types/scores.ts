export interface TeamScore {
  teamId: string;
  teamName: string;
  flights: string[];
  existingScores: Record<string, { id: string; score: string }>;
  newScores: Record<string, string>;
}