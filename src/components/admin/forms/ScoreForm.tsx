import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ScoreFormProps {
  score?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ScoreForm({ score, onSuccess, onCancel }: ScoreFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      event_id: score?.event_id || "",
      team_id: score?.team_id || "",
      score: score?.score || "",
      flight: score?.flight || "",
    },
  });

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: selectedEvent } = useQuery({
    queryKey: ["event", form.watch("event_id")],
    queryFn: async () => {
      if (!form.watch("event_id")) return null;
      const { data, error } = await supabase
        .from("events")
        .select("*, seasons (*)")
        .eq("id", form.watch("event_id"))
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!form.watch("event_id"),
  });

  const { data: teamFlights } = useQuery({
    queryKey: ["teamFlights", form.watch("team_id"), selectedEvent?.season_id],
    queryFn: async () => {
      if (!form.watch("team_id") || !selectedEvent?.season_id) return [];
      const { data, error } = await supabase
        .from("season_teams")
        .select("flight")
        .eq("team_id", form.watch("team_id"))
        .eq("season_id", selectedEvent.season_id);
      if (error) throw error;
      return data.map(st => st.flight);
    },
    enabled: !!form.watch("team_id") && !!selectedEvent?.season_id,
  });

  const onSubmit = async (data: any) => {
    const { error } = score
      ? await supabase
          .from("event_scores")
          .update(data)
          .eq("id", score.id)
      : await supabase.from("event_scores").insert(data);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save score",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Score saved successfully",
    });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="event_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {events?.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="team_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset flight when team changes
                  form.setValue("flight", "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flight</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a flight" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teamFlights?.map((flight: string) => (
                    <SelectItem key={flight} value={flight}>
                      Flight {flight}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
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