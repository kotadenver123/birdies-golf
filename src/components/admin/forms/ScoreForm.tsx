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
import { useScoreForm } from "@/hooks/useScoreForm";

interface ScoreFormProps {
  score?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ScoreForm({ score, onSuccess, onCancel }: ScoreFormProps) {
  const { form, events, teams, teamFlights, onSubmit, onSaveAndAddAnother } = useScoreForm({
    score,
    onSuccess,
  });

  const seasonId = form.watch("season_id");
  const eventId = form.watch("event_id");
  const teamId = form.watch("team_id");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="season_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("event_id", "");
                  form.setValue("team_id", "");
                  form.setValue("flight", "");
                  form.setValue("score", "");
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a season" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {events?.seasons?.map((season: any) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {seasonId && (
          <FormField
            control={form.control}
            name="event_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("team_id", "");
                    form.setValue("flight", "");
                    form.setValue("score", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {events?.events?.filter((event: any) => event.season_id === seasonId)
                      .map((event: any) => (
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
        )}

        {eventId && (
          <FormField
            control={form.control}
            name="team_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
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
                    {teams?.filter((team: any) => {
                      const seasonTeam = team.season_teams?.find(
                        (st: any) => st.season_id === seasonId
                      );
                      return !!seasonTeam;
                    }).map((team: any) => (
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
        )}

        {teamId && (
          <>
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
              name="score_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "Gross"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select score type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gross">Gross</SelectItem>
                      <SelectItem value="Net">Net</SelectItem>
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
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={form.handleSubmit(onSaveAndAddAnother)}
          >
            Save & Add Another
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}