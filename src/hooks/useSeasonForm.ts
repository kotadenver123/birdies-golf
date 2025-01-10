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
    try {
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
        console.error("Season error:", seasonError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save season",
        });
        return;
      }

      const seasonId = savedSeason.id;
      
      // Delete existing season teams if editing
      if (season?.id) {
        const { error: deleteError } = await supabase
          .from("season_teams")
          .delete()
          .eq("season_id", seasonId);

        if (deleteError) {
          console.error("Delete error:", deleteError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update team assignments",
          });
          return;
        }
      }

      // Prepare season teams data
      const seasonTeamsToInsert: SeasonTeamData[] = [];
      
      // Iterate through selected teams and their flights
      Object.entries(data.selectedTeams).forEach(([teamId, flights]) => {
        flights.forEach((flight) => {
          seasonTeamsToInsert.push({
            season_id: seasonId,
            team_id: teamId,
            flight: flight,
          });
        });
      });

      // Insert new season teams if there are any
      if (seasonTeamsToInsert.length > 0) {
        const { error: teamError } = await supabase
          .from("season_teams")
          .insert(seasonTeamsToInsert);

        if (teamError) {
          console.error("Team insert error:", teamError);
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
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  return { handleSubmit };
};