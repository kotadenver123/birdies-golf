import { useState, useEffect } from "react";
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
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string[]>>(initialTeams);
  const { toast } = useToast();

  // Update form value whenever selectedTeams changes
  useEffect(() => {
    form.setValue("selectedTeams", selectedTeams);
  }, [selectedTeams, form]);

  // Update selectedTeams when initialTeams changes
  useEffect(() => {
    if (Object.keys(initialTeams).length > 0) {
      setSelectedTeams(initialTeams);
    }
  }, [initialTeams]);

  const handleTeamFlightChange = (teamId: string, flight: string) => {
    if (!flight || flight.trim() === "") {
      toast({
        variant: "destructive",
        title: "Invalid Flight",
        description: "Flight selection cannot be empty",
      });
      return;
    }

    setSelectedTeams((prev) => {
      const updatedFlights = [...(prev[teamId] || [])];
      if (!updatedFlights.includes(flight)) {
        updatedFlights.push(flight);
      }
      return {
        ...prev,
        [teamId]: updatedFlights,
      };
    });
  };

  const removeTeamFromFlight = (teamId: string, flightToRemove: string) => {
    setSelectedTeams((prev) => {
      const updatedFlights = prev[teamId].filter((flight) => flight !== flightToRemove);
      const newSelectedTeams = { ...prev };
      
      if (updatedFlights.length === 0) {
        delete newSelectedTeams[teamId];
      } else {
        newSelectedTeams[teamId] = updatedFlights;
      }
      
      return newSelectedTeams;
    });
  };

  return (
    <div className="space-y-4">
      <FormLabel>Teams</FormLabel>
      {teams?.map((team) => (
        <div key={team.id} className="space-y-2">
          <div className="font-medium">{team.name}</div>
          <div className="flex flex-wrap gap-2">
            {selectedTeams[team.id]?.map((flight) => (
              <div
                key={`${team.id}-${flight}`}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
              >
                <span>Flight {flight}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => removeTeamFromFlight(team.id, flight)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Select
              value=""
              onValueChange={(value) => handleTeamFlightChange(team.id, value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add to flight..." />
              </SelectTrigger>
              <SelectContent>
                {form.watch("flights").filter(
                  (flight: string) => !selectedTeams[team.id]?.includes(flight)
                ).map((flight: string) => (
                  <SelectItem key={flight} value={flight}>
                    Flight {flight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}