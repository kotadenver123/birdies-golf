import { UseFormReturn } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { TeamFlightList } from "../components/TeamFlightList";
import { TeamFlightSelector } from "../components/TeamFlightSelector";
import { useTeamFlights } from "@/hooks/useTeamFlights";
import { TeamSearch } from "../components/TeamSearch";

interface Team {
  id: string;
  name: string;
}

interface SeasonTeamsProps {
  form: UseFormReturn<any>;
  teams: Team[];
  initialTeams?: Record<string, string[]>;
}

export function SeasonTeams({ form, teams = [], initialTeams = {} }: SeasonTeamsProps) {
  const { selectedTeams, handleTeamFlightChange, removeTeamFromFlight } = useTeamFlights(
    form,
    initialTeams
  );

  const handleTeamSelect = (teamId: string) => {
    // When a team is selected, automatically add it to Flight A
    const defaultFlight = form.watch("flights")?.[0] || "A";
    handleTeamFlightChange(teamId, defaultFlight);
  };

  const availableFlights = form.watch("flights") || ["A"];

  return (
    <div className="space-y-6">
      <div>
        <FormLabel>Add Teams</FormLabel>
        <div className="mt-2">
          <TeamSearch
            teams={teams}
            onTeamSelect={handleTeamSelect}
            selectedTeams={Object.keys(selectedTeams || {})}
          />
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>Selected Teams</FormLabel>
        {Object.entries(selectedTeams || {}).map(([teamId, flights = []]) => {
          const team = teams.find(t => t.id === teamId);
          if (!team) return null;
          
          return (
            <div key={teamId} className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="font-medium">
                {team.name}
              </div>
              <div className="flex flex-wrap gap-2">
                <TeamFlightList
                  teamId={teamId}
                  flights={flights}
                  onRemove={removeTeamFromFlight}
                />
                <TeamFlightSelector
                  availableFlights={availableFlights.filter(
                    (flight: string) => !flights?.includes(flight)
                  )}
                  onFlightSelect={(flight) => handleTeamFlightChange(teamId, flight)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}