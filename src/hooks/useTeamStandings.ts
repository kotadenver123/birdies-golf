import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamStandings = (seasonId: string, flight: string) => {
  return useQuery({
    queryKey: ["standings", seasonId, flight],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("season_teams")
        .select(`
          team_id,
          total_score,
          teams (
            name,
            team_players (
              players (
                name
              )
            )
          )
        `)
        .eq("season_id", seasonId)
        .eq("flight", flight)
        .order("total_score", { ascending: true });

      if (error) throw error;

      return data.map((item, index) => ({
        position: index + 1,
        name: item.teams.name,
        players: item.teams.team_players.map(tp => tp.players.name),
        score: item.total_score,
      }));
    },
    enabled: !!seasonId && !!flight,
  });
};