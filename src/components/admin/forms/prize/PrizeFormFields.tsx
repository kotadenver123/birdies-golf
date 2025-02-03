import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useFormContext } from "react-hook-form";
import { PrizeFormData } from "./PrizeFormProvider";

type Season = Database["public"]["Tables"]["seasons"]["Row"];
type Team = Database["public"]["Tables"]["teams"]["Row"];

export function PrizeFormFields() {
  const form = useFormContext<PrizeFormData>();

  const { data: seasons } = useQuery({
    queryKey: ["seasons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const seasonId = form.watch("season_id");
  const { data: selectedSeason } = useQuery({
    queryKey: ["season", seasonId],
    queryFn: async () => {
      if (!seasonId) return null;
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .eq("id", seasonId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!seasonId,
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

  return (
    <>
      <div>
        <Label>Season</Label>
        <Select
          value={form.watch("season_id")}
          onValueChange={(value) => {
            form.setValue("season_id", value);
            form.setValue("flight", "");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {seasons?.map((season) => (
              <SelectItem key={season.id} value={season.id}>
                {season.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Flight</Label>
        <Select
          value={form.watch("flight")}
          onValueChange={(value) => form.setValue("flight", value)}
          disabled={!selectedSeason}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select flight" />
          </SelectTrigger>
          <SelectContent>
            {selectedSeason?.flights?.map((flight) => (
              <SelectItem key={flight} value={flight}>
                Flight {flight}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Position</Label>
        <Input
          type="number"
          {...form.register("position")}
          min={1}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Input {...form.register("description")} />
      </div>

      <div>
        <Label>Winner</Label>
        <Select
          value={form.watch("winning_team_id")}
          onValueChange={(value) => form.setValue("winning_team_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select winner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Not assigned</SelectItem>
            {teams?.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}