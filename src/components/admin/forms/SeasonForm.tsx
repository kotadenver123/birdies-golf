import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { SeasonBasicInfo } from "./sections/SeasonBasicInfo";
import { SeasonFlights } from "./sections/SeasonFlights";
import { SeasonTeams } from "./sections/SeasonTeams";

interface SeasonFormProps {
  season?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

interface SeasonTeamData {
  season_id: string;
  team_id: string;
  flight: string;
}

export default function SeasonForm({ season, onSuccess, onCancel }: SeasonFormProps) {
  const { toast } = useToast();

  // Fetch existing season teams if editing
  const { data: initialTeams } = useQuery({
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
      selectedTeams: {},
    },
  });

  const onSubmit = async (data: any) => {
    // First save the season
    const { data: savedSeason, error: seasonError } = season
      ? await supabase
          .from("seasons")
          .update({
            title: data.title,
            start_date: data.start_date,
            end_date: data.end_date,
            flights: data.flights,
          })
          .eq("id", season.id)
          .select()
          .single()
      : await supabase
          .from("seasons")
          .insert({
            title: data.title,
            start_date: data.start_date,
            end_date: data.end_date,
            flights: data.flights,
          })
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
    const seasonTeamsToInsert: SeasonTeamData[] = Object.entries(data.selectedTeams)
      .filter(([_, flight]) => flight) // Only include teams that have a flight assigned
      .map(([teamId, flight]) => ({
        season_id: seasonId,
        team_id: teamId,
        flight: flight as string, // Explicitly type as string
      }));

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <SeasonBasicInfo form={form} />
        <SeasonFlights form={form} />
        <SeasonTeams 
          form={form} 
          teams={teams || []} 
          initialTeams={initialTeams} 
        />

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