import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { SeasonEventSelector } from "./components/SeasonEventSelector";
import { ScoresTable } from "./components/ScoresTable";
import { useTeamScores } from "@/hooks/useTeamScores";

interface BulkScoreFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BulkScoreForm({ onSuccess, onCancel }: BulkScoreFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm();

  const seasonId = form.watch("season_id");
  const eventId = form.watch("event_id");
  
  const { teamScores, handleScoreChange } = useTeamScores(seasonId, eventId);

  const handleSubmit = async () => {
    if (!eventId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an event",
      });
      return;
    }

    const scoresToInsert = teamScores.flatMap((team) =>
      Object.entries(team.newScores)
        .filter(([flight, score]) => 
          score !== "" && !team.existingScores[flight]
        )
        .map(([flight, score]) => ({
          event_id: eventId,
          team_id: team.teamId,
          flight,
          score: parseInt(score),
          score_type: "Gross",
        }))
    );

    if (scoresToInsert.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No new scores to save",
      });
      return;
    }

    const { error } = await supabase
      .from("event_scores")
      .insert(scoresToInsert);

    if (error) {
      console.error("Error saving scores:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save scores",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Scores saved successfully",
    });
    queryClient.invalidateQueries({ queryKey: ["scores"] });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <SeasonEventSelector form={form} />

        {eventId && teamScores.length > 0 && (
          <div className="mt-6">
            <ScoresTable
              teamScores={teamScores}
              onScoreChange={handleScoreChange}
            />
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save New Scores
          </Button>
        </div>
      </form>
    </Form>
  );
}