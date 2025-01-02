import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string | null;
  status: "upcoming" | "completed";
  event_date: string;
  event_time: string | null;
  format: string | null;
  details: string | null;
  image_url: string | null;
  season_id: string;
}

export const useEvents = (seasonId: string) => {
  return useQuery({
    queryKey: ["events", seasonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("season_id", seasonId)
        .order("event_date", { ascending: true });

      if (error) throw error;

      return data.map(event => ({
        ...event,
        id: event.id,
        date: event.event_date,
        // Ensure status is either "upcoming" or "completed"
        status: event.status === "upcoming" ? "upcoming" : "completed"
      })) as Event[];
    },
    enabled: !!seasonId,
  });
};