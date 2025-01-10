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

      if (error) {
        console.error("Error fetching prizes:", error);
        throw error;
      }
      return data;
    },
    enabled: !!seasonId && !!flight, // Only run query when both seasonId and flight are available
  });

  if (isLoading) return <div>Loading prizes...</div>;
  if (!prizes?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Prizes</h2>
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