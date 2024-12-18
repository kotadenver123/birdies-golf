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
    enabled: !!seasonId,
  });

  if (isLoading) return <div>Loading prizes...</div>;
  if (!prizes?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-golf-accent" />
        <h2 className="text-xl font-semibold">Prizes</h2>
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {prizes.map((prize) => (
          <div 
            key={prize.id} 
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium text-gray-500">Position</div>
              <div className="text-sm">{prize.position}</div>
              
              <div className="text-sm font-medium text-gray-500">Prize</div>
              <div className="text-sm break-words">{prize.description}</div>
              
              <div className="text-sm font-medium text-gray-500">Winner</div>
              <div className="text-sm break-words">{prize.teams?.name || "TBD"}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Position</TableHead>
              <TableHead className="min-w-[200px]">Prize</TableHead>
              <TableHead className="min-w-[200px]">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.map((prize) => (
              <TableRow key={prize.id}>
                <TableCell>{prize.position}</TableCell>
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