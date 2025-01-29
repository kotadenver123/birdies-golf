import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Prize = Database["public"]["Tables"]["prizes"]["Row"];
type Season = Database["public"]["Tables"]["seasons"]["Row"];
type Team = Database["public"]["Tables"]["teams"]["Row"];

interface PrizeFormData {
  season_id: string;
  flight: string;
  position: number;
  description: string;
  winning_team_id: string;
}

interface PrizeFormProps {
  prize?: Prize;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PrizeForm({ prize, onSuccess, onCancel }: PrizeFormProps) {
  const { toast } = useToast();
  const form = useForm<PrizeFormData>({
    defaultValues: {
      season_id: prize?.season_id || "",
      flight: prize?.flight || "",
      position: prize?.position || 1,
      description: prize?.description || "",
      winning_team_id: prize?.winning_team_id || "unassigned",
    },
  });

  const { data: seasons } = useQuery<Season[]>({
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

  const { data: selectedSeason } = useQuery<Season | null>({
    queryKey: ["season", form.watch("season_id")],
    queryFn: async () => {
      if (!form.watch("season_id")) return null;
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .eq("id", form.watch("season_id"))
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!form.watch("season_id"),
  });

  const { data: teams } = useQuery<Team[]>({
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

  const onSubmit = async (data: PrizeFormData) => {
    const formData = {
      ...data,
      winning_team_id: data.winning_team_id === "unassigned" ? null : data.winning_team_id,
    };

    const { error } = prize
      ? await supabase
          .from("prizes")
          .update(formData)
          .eq("id", prize.id)
      : await supabase.from("prizes").insert(formData);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save prize",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Prize saved successfully",
    });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Season</Label>
          <Select
            value={form.watch("season_id")}
            onValueChange={(value) => {
              form.setValue("season_id", value);
              form.setValue("flight", ""); // Reset flight when season changes
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