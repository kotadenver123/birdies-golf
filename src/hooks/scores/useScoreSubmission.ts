import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScoreData {
  season_id: string;
  event_id: string;
  team_id: string;
  score: string;
  flight: string;
  score_type: string;
}

export function useScoreSubmission(score: any, onSuccess: () => void) {
  const { toast } = useToast();

  const handleSave = async (data: ScoreData, resetForm: boolean = false) => {
    // Remove season_id from the data object since it's not a column in event_scores
    const { season_id, ...scoreData } = data;
    
    // Convert score from string to number
    const formattedData = {
      ...scoreData,
      score: Number(scoreData.score)
    };

    if (score) {
      const { error } = await supabase
        .from("event_scores")
        .update(formattedData)
        .eq("id", score.id);

      if (error) {
        console.error("Update error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update score",
        });
        return false;
      }
    } else {
      const { error } = await supabase
        .from("event_scores")
        .insert([formattedData]);

      if (error) {
        console.error("Insert error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create score",
        });
        return false;
      }
    }

    toast({
      title: "Success",
      description: "Score saved successfully",
    });

    return true;
  };

  return { handleSave };
}