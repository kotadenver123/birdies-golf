import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

interface SeasonFormProps {
  season?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SeasonForm({ season, onSuccess, onCancel }: SeasonFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: season?.title || "",
      start_date: season?.start_date || "",
      end_date: season?.end_date || "",
      flights: season?.flights || ["A", "B"],
    },
  });

  const onSubmit = async (data: any) => {
    const { error } = season
      ? await supabase
          .from("seasons")
          .update(data)
          .eq("id", season.id)
      : await supabase.from("seasons").insert(data);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save season",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Season saved successfully",
    });
    onSuccess();
  };

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}