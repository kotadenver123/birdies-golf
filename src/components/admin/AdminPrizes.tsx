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
import PrizeForm from "./forms/PrizeForm";

export default function AdminPrizes() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPrize, setEditingPrize] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prizes, isLoading } = useQuery({
    queryKey: ["prizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prizes")
        .select(`
          *,
          seasons (title),
          teams (name)
        `)
        .order("position");
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("prizes").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete prize",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["prizes"] });
    toast({
      title: "Success",
      description: "Prize deleted successfully",
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prizes</h1>
        <Button onClick={() => setIsCreating(true)}>Create Prize</Button>
      </div>

      {(isCreating || editingPrize) && (
        <div className="mb-6">
          <PrizeForm
            prize={editingPrize}
            onSuccess={() => {
              setIsCreating(false);
              setEditingPrize(null);
              queryClient.invalidateQueries({ queryKey: ["prizes"] });
            }}
            onCancel={() => {
              setIsCreating(false);
              setEditingPrize(null);
            }}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Season</TableHead>
            <TableHead>Flight</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Winner</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prizes?.map((prize) => (
            <TableRow key={prize.id}>
              <TableCell>{prize.seasons?.title}</TableCell>
              <TableCell>{prize.flight}</TableCell>
              <TableCell>{prize.position}</TableCell>
              <TableCell>{prize.description}</TableCell>
              <TableCell>{prize.teams?.name || "Not assigned"}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingPrize(prize)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(prize.id)}
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