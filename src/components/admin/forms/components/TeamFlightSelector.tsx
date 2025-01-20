import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamFlightSelectorProps {
  availableFlights: string[];
  onFlightSelect: (flight: string) => void;
}

export function TeamFlightSelector({ availableFlights, onFlightSelect }: TeamFlightSelectorProps) {
  return (
    <Select value="" onValueChange={onFlightSelect}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Add to flight..." />
      </SelectTrigger>
      <SelectContent>
        {availableFlights.map((flight) => (
          <SelectItem key={flight} value={flight}>
            Flight {flight}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}