import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface SeasonFormProps {
  season?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SeasonForm({ season, onSuccess, onCancel }: SeasonFormProps) {
  const { toast } = useToast();
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>(
    {} // Map of teamId to flight
  );

  // Fetch existing season teams if editing
  useQuery({
    queryKey: ["seasonTeams", season?.id],
    queryFn: async () => {
      if (!season?.id) return {};
      const { data } = await supabase
        .from("season_teams")
        .select("team_id, flight")
        .eq("season_id", season.id);
      
      const teamFlightMap: Record<string, string> = {};
      data?.forEach((st) => {
        teamFlightMap[st.team_id] = st.flight;
      });
      setSelectedTeams(teamFlightMap);
      return teamFlightMap;
    },
    enabled: !!season?.id,
  });

  // Fetch available teams
  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm({
    defaultValues: {
      title: season?.title || "",
      start_date: season?.start_date || "",
      end_date: season?.end_date || "",
      flights: season?.flights || ["A"],
    },
  });

  const onSubmit = async (data: any) => {
    // First save the season
    const { data: savedSeason, error: seasonError } = season
      ? await supabase
          .from("seasons")
          .update(data)
          .eq("id", season.id)
          .select()
          .single()
      : await supabase
          .from("seasons")
          .insert(data)
          .select()
          .single();

    if (seasonError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save season",
      });
      return;
    }

    // Then handle season teams
    const seasonId = savedSeason.id;
    
    // Delete existing season teams if editing
    if (season?.id) {
      await supabase
        .from("season_teams")
        .delete()
        .eq("season_id", seasonId);
    }

    // Insert new season teams
    const seasonTeamsToInsert = Object.entries(selectedTeams).map(
      ([teamId, flight]) => ({
        season_id: seasonId,
        team_id: teamId,
        flight: flight,
      })
    );

    if (seasonTeamsToInsert.length > 0) {
      const { error: teamError } = await supabase
        .from("season_teams")
        .insert(seasonTeamsToInsert);

      if (teamError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save team assignments",
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Season saved successfully",
    });
    onSuccess();
  };

  const addFlight = () => {
    const currentFlights = form.getValues("flights");
    const nextFlightLetter = String.fromCharCode(
      "A".charCodeAt(0) + currentFlights.length
    );
    form.setValue("flights", [...currentFlights, nextFlightLetter]);
  };

  const removeFlight = (index: number) => {
    const currentFlights = form.getValues("flights");
    form.setValue(
      "flights",
      currentFlights.filter((_, i) => i !== index)
    );
  };

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flights"
          render={() => (
            <FormItem>
              <FormLabel>Flights</FormLabel>
              <div className="space-y-2">
                {form.watch("flights").map((flight: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={`Flight ${flight}`}
                      readOnly
                      className="bg-gray-50"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFlight(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFlight}
                  className="w-full"
                >
                  Add Flight
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}