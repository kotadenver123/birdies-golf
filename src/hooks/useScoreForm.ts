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
      season_id: score?.event?.season_id || "",
      event_id: score?.event_id || "",
      team_id: score?.team_id || "",
      score: score?.score || "",
      flight: score?.flight || "",
      score_type: score?.score_type || "Gross",
    },
  });

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
        ...eventsResponse.data,
        seasons: seasonsResponse.data,
      };
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["teams", form.watch("season_id")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*, season_teams(*)")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: teamFlights } = useQuery({
    queryKey: ["teamFlights", form.watch("team_id"), form.watch("season_id")],
    queryFn: async () => {
      if (!form.watch("team_id") || !form.watch("season_id")) return [];
      const { data, error } = await supabase
        .from("season_teams")
        .select("flight")
        .eq("team_id", form.watch("team_id"))
        .eq("season_id", form.watch("season_id"));
      if (error) throw error;
      return data.map(st => st.flight);
    },
    enabled: !!form.watch("team_id") && !!form.watch("season_id"),
  });

  const handleSave = async (data: any, resetForm: boolean = false) => {
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

    if (resetForm) {
      const seasonId = form.getValues("season_id");
      const eventId = form.getValues("event_id");
      form.reset({
        season_id: seasonId,
        event_id: eventId,
        team_id: "",
        score: "",
        flight: "",
        score_type: "Gross",
      });
    } else {
      onSuccess();
    }
  };

  const onSubmit = async (data: any) => {
    await handleSave(data, false);
  };

  const onSaveAndAddAnother = async (data: any) => {
    await handleSave(data, true);
  };

  return {
    form,
    events,
    teams,
    teamFlights,
    onSubmit,
    onSaveAndAddAnother,
  };
}