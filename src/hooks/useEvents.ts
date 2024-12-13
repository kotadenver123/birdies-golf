import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const useEvents = (seasonId: string) => {
  return useQuery({
    queryKey: ["events", seasonId],
    queryFn: async () => {
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select(`
          *,
          event_scores (
            score,
            team:teams (
              name,
              team_players (
                players (
                  name
                )
              )
            )
          )
        `)
        .eq("season_id", seasonId)
        .order("event_date", { ascending: true });

      if (eventsError) throw eventsError;

      return events.map((event) => ({
        ...event,
        date: format(new Date(event.event_date), "MMMM d, yyyy"),
        event_time: event.event_time 
          ? format(new Date(`2000-01-01T${event.event_time}`), "h:mm a")
          : undefined,
        teams: event.event_scores?.map((score) => ({
          name: score.team.name,
          players: score.team.team_players.map((tp) => tp.players.name),
          score: score.score
        }))
      }));
    },
    enabled: !!seasonId,
  });
};