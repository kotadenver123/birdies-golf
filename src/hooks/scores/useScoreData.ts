import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useScoreData(seasonId: string, teamId: string) {
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const [eventsResponse, seasonsResponse] = await Promise.all([
        supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: false }),
        supabase
          .from("seasons")
          .select("*")
          .order("start_date", { ascending: false }),
      ]);

      if (eventsResponse.error) throw eventsResponse.error;
      if (seasonsResponse.error) throw seasonsResponse.error;

      return {
        events: eventsResponse.data || [],
        seasons: seasonsResponse.data || [],
      };
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["teams", seasonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*, season_teams(*)")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: teamFlights } = useQuery({
    queryKey: ["teamFlights", teamId, seasonId],
    queryFn: async () => {
      if (!teamId || !seasonId) return [];
      const { data, error } = await supabase
        .from("season_teams")
        .select("flight")
        .eq("team_id", teamId)
        .eq("season_id", seasonId);
      if (error) throw error;
      return (data || []).map(st => st.flight);
    },
    enabled: !!teamId && !!seasonId,
  });

  return { events, teams, teamFlights };
}