import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface Team {
  id: string;
  name: string;
}

interface SeasonTeamsProps {
  form: UseFormReturn<any>;
  teams: Team[];
  initialTeams?: Record<string, string>;
}

export function SeasonTeams({ form, teams, initialTeams = {} }: SeasonTeamsProps) {
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>(
    initialTeams
  );

  const handleTeamFlightChange = (teamId: string, flight: string) => {
    setSelectedTeams((prev) => ({
      ...prev,
      [teamId]: flight,
    }));
  };

  const removeTeam = (teamId: string) => {
    setSelectedTeams((prev) => {
      const newTeams = { ...prev };
      delete newTeams[teamId];
      return newTeams;
    });
  };

  // Expose selectedTeams to parent component
  form.setValue("selectedTeams", selectedTeams);

  return (
    <div className="space-y-2">
      <FormLabel>Teams</FormLabel>
      {teams?.map((team) => (
        <div key={team.id} className="flex items-center gap-2">
          <div className="flex-grow">
            <Select
              value={selectedTeams[team.id] || ""}
              onValueChange={(value) => handleTeamFlightChange(team.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Assign ${team.name} to a flight`} />
              </SelectTrigger>
              <SelectContent>
                {form.watch("flights").map((flight: string) => (
                  <SelectItem key={flight} value={flight}>
                    Flight {flight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedTeams[team.id] && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeTeam(team.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}