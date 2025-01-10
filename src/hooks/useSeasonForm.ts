import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SeasonTeamData {
  season_id: string;
  team_id: string;
  flight: string;
}

interface SeasonFormData {
  title: string;
  start_date: string;
  end_date: string;
  flights: string[];
  selectedTeams: Record<string, string[]>;
}

export const useSeasonForm = (season: any, onSuccess: () => void) => {
  const { toast } = useToast();

  const handleSubmit = async (data: SeasonFormData) => {
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
      .flatMap(([teamId, flights]) =>
        flights.map((flight) => ({
          season_id: seasonId,
          team_id: teamId,
          flight: flight,
        }))
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

  return { handleSubmit };
};