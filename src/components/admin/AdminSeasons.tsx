import { useState } from "react";
import { useSeasons } from "@/hooks/useSeasons";
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
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import SeasonForm from "./forms/SeasonForm";

export default function AdminSeasons() {
  const { data: seasons, isLoading } = useSeasons();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSeason, setEditingSeason] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("seasons").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete season",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["seasons"] });
    toast({
      title: "Success",
      description: "Season deleted successfully",
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seasons</h1>
        <Button onClick={() => setIsCreating(true)}>Create Season</Button>
      </div>

      {(isCreating || editingSeason) && (
        <div className="mb-6">
          <SeasonForm
            season={editingSeason}
            onSuccess={() => {
              setIsCreating(false);
              setEditingSeason(null);
              queryClient.invalidateQueries({ queryKey: ["seasons"] });
            }}
            onCancel={() => {
              setIsCreating(false);
              setEditingSeason(null);
            }}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seasons?.map((season) => (
            <TableRow key={season.id}>
              <TableCell>{season.title}</TableCell>
              <TableCell>{format(new Date(season.start_date), "PP")}</TableCell>
              <TableCell>{format(new Date(season.end_date), "PP")}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingSeason(season)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(season.id)}
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