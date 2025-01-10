import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseScoreFormProps {
  score?: any;
  onSuccess: () => void;
}

export function useScoreForm({ score, onSuccess }: UseScoreFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      event_id: score?.event_id || "",
      team_id: score?.team_id || "",
      score: score?.score || "",
      flight: score?.flight || "",
    },
  });

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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

  const { data: selectedEvent } = useQuery({
    queryKey: ["event", form.watch("event_id")],
    queryFn: async () => {
      if (!form.watch("event_id")) return null;
      const { data, error } = await supabase
        .from("events")
        .select("*, seasons (*)")
        .eq("id", form.watch("event_id"))
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!form.watch("event_id"),
  });

  const { data: teamFlights } = useQuery({
    queryKey: ["teamFlights", form.watch("team_id"), selectedEvent?.season_id],
    queryFn: async () => {
      if (!form.watch("team_id") || !selectedEvent?.season_id) return [];
      const { data, error } = await supabase
        .from("season_teams")
        .select("flight")
        .eq("team_id", form.watch("team_id"))
        .eq("season_id", selectedEvent.season_id);
      if (error) throw error;
      return data.map(st => st.flight);
    },
    enabled: !!form.watch("team_id") && !!selectedEvent?.season_id,
  });

  const onSubmit = async (data: any) => {
    if (score) {
      const { error } = await supabase
        .from("event_scores")
        .update(data)
        .eq("id", score.id);

      if (error) {
        console.error("Update error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update score",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from("event_scores")
        .insert([data]);

      if (error) {
        console.error("Insert error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create score",
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Score saved successfully",
    });
    onSuccess();
  };

  return {
    form,
    events,
    teams,
    teamFlights,
    onSubmit,
  };
}