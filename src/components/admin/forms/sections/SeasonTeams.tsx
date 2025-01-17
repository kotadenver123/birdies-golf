import { UseFormReturn } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { TeamFlightList } from "../components/TeamFlightList";
import { TeamFlightSelector } from "../components/TeamFlightSelector";
import { useTeamFlights } from "@/hooks/useTeamFlights";

interface Team {
  id: string;
  name: string;
}

interface SeasonTeamsProps {
  form: UseFormReturn<any>;
  teams: Team[];
  initialTeams?: Record<string, string[]>;
}

export function SeasonTeams({ form, teams, initialTeams = {} }: SeasonTeamsProps) {
  const { selectedTeams, handleTeamFlightChange, removeTeamFromFlight } = useTeamFlights(
    form,
    initialTeams
  );

  return (
    <div className="space-y-4">
      <FormLabel>Teams</FormLabel>
      {teams?.map((team) => (
        <div key={team.id} className="space-y-2">
          <div className="font-medium">{team.name}</div>
          <div className="flex flex-wrap gap-2">
            <TeamFlightList
              teamId={team.id}
              flights={selectedTeams[team.id] || []}
              onRemove={removeTeamFromFlight}
            />
            <TeamFlightSelector
              availableFlights={form.watch("flights").filter(
                (flight: string) => !selectedTeams[team.id]?.includes(flight)
              )}
              onFlightSelect={(flight) => handleTeamFlightChange(team.id, flight)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}