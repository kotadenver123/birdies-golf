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
      console.log("Fetching prizes for season:", seasonId, "flight:", flight);
      const { data, error } = await supabase
        .from("prizes")
        .select(`
          *,
          teams (name)
        `)
        .eq("season_id", seasonId)
        .eq("flight", flight);

      if (error) {
        console.error("Error fetching prizes:", error);
        throw error;
      }
      console.log("Fetched prizes:", data);
      return data;
    },
    enabled: !!seasonId && !!flight,
  });

  if (isLoading) {
    console.log("Loading prizes...");
    return <div>Loading prizes...</div>;
  }

  if (!prizes?.length) {
    console.log("No prizes found");
    return null;
  }

  console.log("Rendering prizes:", prizes);

  return (
    <div className="bg-white rounded-lg p-4 mt-6">
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