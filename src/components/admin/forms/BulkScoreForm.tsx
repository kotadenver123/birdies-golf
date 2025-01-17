import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface BulkScoreFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface TeamScore {
  teamId: string;
  teamName: string;
  flights: string[];
  scores: Record<string, { id?: string; score: string; score_type: string }>;
}

export default function BulkScoreForm({ onSuccess, onCancel }: BulkScoreFormProps) {
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm();

  const seasonId = form.watch("season_id");
  const eventId = form.watch("event_id");

  // Fetch seasons
  const { data: seasons } = useQuery({
    queryKey: ["seasons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch events for selected season
  const { data: events } = useQuery({
    queryKey: ["events", seasonId],
    queryFn: async () => {
      if (!seasonId) return [];
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("season_id", seasonId)
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!seasonId,
  });

  // Fetch teams and their flights for the selected season
  useEffect(() => {
    const fetchTeamsAndScores = async () => {
      if (!seasonId) return;

      const { data: seasonTeams, error: seasonTeamsError } = await supabase
        .from("season_teams")
        .select(`
          team_id,
          flight,
          teams (
            name
          )
        `)
        .eq("season_id", seasonId);

      if (seasonTeamsError) {
        console.error("Error fetching season teams:", seasonTeamsError);
        return;
      }

      // Group teams by team_id and collect their flights
      const teamMap = new Map<string, TeamScore>();
      seasonTeams.forEach((st) => {
        const existingTeam = teamMap.get(st.team_id);
        if (existingTeam) {
          existingTeam.flights.push(st.flight);
        } else {
          teamMap.set(st.team_id, {
            teamId: st.team_id,
            teamName: st.teams?.name || "",
            flights: [st.flight],
            scores: {},
          });
        }
      });

      // If an event is selected, fetch existing scores
      if (eventId) {
        const { data: existingScores, error: scoresError } = await supabase
          .from("event_scores")
          .select("*")
          .eq("event_id", eventId);

        if (!scoresError && existingScores) {
          existingScores.forEach((score) => {
            const team = teamMap.get(score.team_id);
            if (team) {
              team.scores[score.flight] = {
                id: score.id,
                score: score.score.toString(),
                score_type: score.score_type,
              };
            }
          });
        }
      }

      setTeamScores(Array.from(teamMap.values()));
    };

    fetchTeamsAndScores();
  }, [seasonId, eventId]);

  const handleScoreChange = (teamId: string, flight: string, value: string) => {
    setTeamScores((prev) =>
      prev.map((team) => {
        if (team.teamId === teamId) {
          return {
            ...team,
            scores: {
              ...team.scores,
              [flight]: {
                ...team.scores[flight],
                score: value,
                score_type: "Gross", // Default to Gross for bulk entry
              },
            },
          };
        }
        return team;
      })
    );
  };

  const handleSubmit = async () => {
    if (!eventId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an event",
      });
      return;
    }

    const scoresToUpsert = teamScores.flatMap((team) =>
      Object.entries(team.scores)
        .filter(([, scoreData]) => scoreData.score !== "")
        .map(([flight, scoreData]) => ({
          id: scoreData.id,
          event_id: eventId,
          team_id: team.teamId,
          flight,
          score: parseInt(scoreData.score),
          score_type: scoreData.score_type,
        }))
    );

    const { error } = await supabase
      .from("event_scores")
      .upsert(scoresToUpsert, { onConflict: "id" });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save scores",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Scores saved successfully",
    });
    queryClient.invalidateQueries({ queryKey: ["scores"] });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="season_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("event_id", "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a season" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {seasons?.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {seasonId && (
          <FormField
            control={form.control}
            name="event_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {events?.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {eventId && teamScores.length > 0 && (
          <div className="mt-6">
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
                            <Input
                              type="number"
                              value={team.scores[flight]?.score || ""}
                              onChange={(e) =>
                                handleScoreChange(team.teamId, flight, e.target.value)
                              }
                              className="w-full"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save All Scores
          </Button>
        </div>
      </form>
    </Form>
  );
}