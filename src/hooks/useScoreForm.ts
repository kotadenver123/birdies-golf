import { useForm } from "react-hook-form";
import { useScoreData } from "./scores/useScoreData";
import { useScoreSubmission } from "./scores/useScoreSubmission";

interface UseScoreFormProps {
  score?: any;
  onSuccess: () => void;
}

export function useScoreForm({ score, onSuccess }: UseScoreFormProps) {
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

  const { events, teams, teamFlights } = useScoreData(
    form.watch("season_id"),
    form.watch("team_id")
  );

  const { handleSave } = useScoreSubmission(score, onSuccess);

  const onSubmit = async (data: any) => {
    const success = await handleSave(data, false);
    if (success) {
      onSuccess();
    }
  };

  const onSaveAndAddAnother = async (data: any) => {
    const success = await handleSave(data, true);
    if (success) {
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
    }
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