import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TeamFlightListProps {
  teamId: string;
  flights: string[];
  onRemove: (teamId: string, flight: string) => void;
}

export function TeamFlightList({ teamId, flights, onRemove }: TeamFlightListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {flights.map((flight) => (
        <div
          key={`${teamId}-${flight}`}
          className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
        >
          <span>Flight {flight}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => onRemove(teamId, flight)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}