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
    enabled: !!seasonId, // Only run the query if seasonId is defined
  });

  if (isLoading) return <div>Loading prizes...</div>;
  if (!prizes?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-golf-accent" />
        <h2 className="text-xl font-semibold">Prizes</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Position</TableHead>
              <TableHead className="min-w-[200px]">Prize</TableHead>
              <TableHead className="min-w-[150px]">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((prize) => (
              <TableRow key={prize.id}>
                <TableCell className="text-center">{prize.position}</TableCell>
                <TableCell className="whitespace-normal break-words">
                  {prize.description}
                </TableCell>
                <TableCell className="whitespace-normal break-words">
                  {prize.teams?.name || "TBD"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};