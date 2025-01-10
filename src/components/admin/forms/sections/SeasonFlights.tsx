import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";

interface SeasonFlightsProps {
  form: UseFormReturn<any>;
}

export function SeasonFlights({ form }: SeasonFlightsProps) {
  const addFlight = () => {
    const currentFlights = form.getValues("flights");
    const nextFlightLetter = String.fromCharCode(
      "A".charCodeAt(0) + currentFlights.length
    );
    form.setValue("flights", [...currentFlights, nextFlightLetter]);
  };

  const removeFlight = (index: number) => {
    const currentFlights = form.getValues("flights");
    form.setValue(
      "flights",
      currentFlights.filter((_, i) => i !== index)
    );
  };

  return (
    <FormField
      control={form.control}
      name="flights"
      render={() => (
        <FormItem>
          <FormLabel>Flights</FormLabel>
          <div className="space-y-2">
            {form.watch("flights").map((flight: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={`Flight ${flight}`}
                  readOnly
                  className="bg-gray-50"
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFlight(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addFlight}
              className="w-full"
            >
              Add Flight
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}