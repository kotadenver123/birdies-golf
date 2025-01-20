import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

export function useTeamFlights(form: UseFormReturn<any>, initialTeams: Record<string, string[]> = {}) {
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string[]>>(initialTeams);
  const { toast } = useToast();

  useEffect(() => {
    form.setValue("selectedTeams", selectedTeams);
  }, [selectedTeams, form]);

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
      const currentFlights = prev[teamId] || [];
      const updatedFlights = currentFlights.filter((flight) => flight !== flightToRemove);
      const newSelectedTeams = { ...prev };
      
      if (updatedFlights.length === 0) {
        delete newSelectedTeams[teamId];
      } else {
        newSelectedTeams[teamId] = updatedFlights;
      }
      
      return newSelectedTeams;
    });
  };

  return {
    selectedTeams,
    handleTeamFlightChange,
    removeTeamFromFlight,
  };
}