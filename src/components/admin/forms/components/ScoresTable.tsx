import { Input } from "@/components/ui/input";
import { TeamScore } from "../types/scores";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ScoresTableProps {
  teamScores: TeamScore[];
  onScoreChange: (teamId: string, flight: string, value: string) => void;
  eventId: string | null;
}

export function ScoresTable({ teamScores, onScoreChange, eventId }: ScoresTableProps) {
  // Fetch season flights based on the event
  const { data: seasonFlights } = useQuery({
    queryKey: ["seasonFlights", eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data: event } = await supabase
        .from("events")
        .select("season_id")
        .eq("id", eventId)
        .single();

      if (!event?.season_id) return [];

      const { data: season } = await supabase
        .from("seasons")
        .select("flights")
        .eq("id", event.season_id)
        .single();

      return season?.flights || [];
    },
    enabled: !!eventId,
  });

  const flights = seasonFlights || [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2 border">Team</th>
            {flights.map((flight) => (
              <th key={flight} className="text-left p-2 border">
                Flight {flight} Score
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teamScores.map((team) => (
            <tr key={team.teamId}>
              <td className="p-2 border">{team.teamName}</td>
              {flights.map((flight) => (
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