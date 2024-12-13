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
              <TableHead className="hidden md:table-cell">Players</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.name}>
                <TableCell className="font-medium">
                  {team.position === 1 && (
                    <Trophy className="w-4 h-4 text-golf-accent inline mr-1" />
                  )}
                  {team.position}
                </TableCell>
                <TableCell className="font-semibold">{team.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {team.players.join(" • ")}
                </TableCell>
                <TableCell className="text-right">{team.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};