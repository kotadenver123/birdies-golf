import { Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Team {
  position: number;
  name: string;
  players: string[];
  score: number;
}

interface StandingsTableProps {
  teams: Team[];
  flight: string;
}

export const StandingsTable = ({ teams, flight }: StandingsTableProps) => {
  // Process teams to handle ties
  const teamsWithTiePositions = teams.map((team, index) => {
    // Check if there are any teams with the same score as the current team
    const tiedTeams = teams.filter((t) => t.score === team.score);
    const isTied = tiedTeams.length > 1;
    
    // If tied, use the position of the first team with this score
    const firstTeamWithScore = teams.findIndex((t) => t.score === team.score);
    const displayPosition = firstTeamWithScore + 1;
    
    return {
      ...team,
      isTied,
      displayPosition: isTied ? `T-${displayPosition}` : team.position,
      isFirstPlace: displayPosition === 1,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-golf-secondary">
          Current Standings
        </h2>
        <div className="bg-golf-secondary text-white px-3 py-1 rounded text-sm md:text-base">
          Flight {flight}
        </div>
      </div>
      <div className="min-w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamsWithTiePositions.map((team) => (
              <TableRow key={team.name}>
                <TableCell className="font-medium">
                  {team.isFirstPlace && (
                    <Trophy className="w-4 h-4 text-golf-accent inline mr-1" />
                  )}
                  {team.displayPosition}
                </TableCell>
                <TableCell className="font-semibold">{team.name}</TableCell>
                <TableCell className="text-right">{team.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};