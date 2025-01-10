import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SeasonBasicInfo } from "./sections/SeasonBasicInfo";
import { SeasonFlights } from "./sections/SeasonFlights";
import { SeasonTeams } from "./sections/SeasonTeams";
import { useSeasonForm } from "@/hooks/useSeasonForm";

interface SeasonFormProps {
  season?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SeasonForm({ season, onSuccess, onCancel }: SeasonFormProps) {
  // Fetch existing season teams if editing
  const { data: initialTeams } = useQuery({
    queryKey: ["seasonTeams", season?.id],
    queryFn: async () => {
      if (!season?.id) return {};
      const { data } = await supabase
        .from("season_teams")
        .select("team_id, flight")
        .eq("season_id", season.id);
      
      const teamFlightMap: Record<string, string> = {};
      data?.forEach((st) => {
        teamFlightMap[st.team_id] = st.flight;
      });
      return teamFlightMap;
    },
    enabled: !!season?.id,
  });

  // Fetch available teams
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

  const form = useForm({
    defaultValues: {
      title: season?.title || "",
      start_date: season?.start_date || "",
      end_date: season?.end_date || "",
      flights: season?.flights || ["A"],
      selectedTeams: {},
    },
  });

  const { handleSubmit } = useSeasonForm(season, onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <SeasonBasicInfo form={form} />
        <SeasonFlights form={form} />
        <SeasonTeams 
          form={form} 
          teams={teams || []} 
          initialTeams={initialTeams} 
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}