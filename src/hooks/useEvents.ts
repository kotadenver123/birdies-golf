import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      return data;
    },
    enabled: !!seasonId,
  });
};