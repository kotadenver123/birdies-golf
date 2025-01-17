import { Input } from "@/components/ui/input";
import { TeamScore } from "../types/scores";

interface ScoresTableProps {
  teamScores: TeamScore[];
  onScoreChange: (teamId: string, flight: string, value: string) => void;
}

export function ScoresTable({ teamScores, onScoreChange }: ScoresTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2 border">Team</th>
            <th className="text-left p-2 border">Flight A Score</th>
            <th className="text-left p-2 border">Flight B Score</th>
          </tr>
        </thead>
        <tbody>
          {teamScores.map((team) => (
            <tr key={team.teamId}>
              <td className="p-2 border">{team.teamName}</td>
              {["A", "B"].map((flight) => (
                <td key={flight} className="p-2 border">
                  {team.flights.includes(flight) && (
                    team.existingScores[flight] ? (
                      <div className="text-gray-500">
                        Existing score: {team.existingScores[flight].score}
                      </div>
                    ) : (
                      <Input
                        type="number"
                        value={team.newScores[flight] || ""}
                        onChange={(e) =>
                          onScoreChange(team.teamId, flight, e.target.value)
                        }
                        className="w-full"
                      />
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}