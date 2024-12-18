import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface PrizesDisplayProps {
  seasonId: string;
  flight: string;
}

export const PrizesDisplay = ({ seasonId, flight }: PrizesDisplayProps) => {
  const { data: prizes, isLoading } = useQuery({
    queryKey: ["prizes", seasonId, flight],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prizes")
        .select(`
          *,
          teams (name)
        `)
        .eq("season_id", seasonId)
        .eq("flight", flight)
        .order("position");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading prizes...</div>;
  if (!prizes?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-golf-accent" />
        <h2 className="text-xl font-semibold">Prizes</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Prize</TableHead>
            <TableHead>Winner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prizes.map((prize) => (
            <TableRow key={prize.id}>
              <TableCell>{prize.position}</TableCell>
              <TableCell>{prize.description}</TableCell>
              <TableCell>{prize.teams?.name || "TBD"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};