import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash } from "lucide-react";
import ScoreForm from "./forms/ScoreForm";

export default function AdminScores() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingScore, setEditingScore] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scores, isLoading } = useQuery({
    queryKey: ["scores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_scores")
        .select(`
          *,
          events (
            title
          ),
          teams (
            name
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("event_scores").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete score",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["scores"] });
    toast({
      title: "Success",
      description: "Score deleted successfully",
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scores</h1>
        <Button onClick={() => setIsCreating(true)}>Create Score</Button>
      </div>

      {(isCreating || editingScore) && (
        <div className="mb-6">
          <ScoreForm
            score={editingScore}
            onSuccess={() => {
              setIsCreating(false);
              setEditingScore(null);
              queryClient.invalidateQueries({ queryKey: ["scores"] });
            }}
            onCancel={() => {
              setIsCreating(false);
              setEditingScore(null);
            }}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores?.map((score) => (
            <TableRow key={score.id}>
              <TableCell>{score.events?.title}</TableCell>
              <TableCell>{score.teams?.name}</TableCell>
              <TableCell>{score.score}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingScore(score)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(score.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}