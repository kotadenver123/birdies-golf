import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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

      return data.map((event) => ({
        ...event,
        date: format(new Date(event.event_date), "MMMM d, yyyy"),
        event_time: event.event_time 
          ? format(new Date(`2000-01-01T${event.event_time}`), "h:mm a")
          : undefined
      }));
    },
    enabled: !!seasonId,
  });
};