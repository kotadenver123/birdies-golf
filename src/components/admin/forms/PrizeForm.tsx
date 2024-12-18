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

interface PrizeFormProps {
  prize?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PrizeForm({ prize, onSuccess, onCancel }: PrizeFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      season_id: prize?.season_id || "",
      flight: prize?.flight || "A",
      position: prize?.position || 1,
      description: prize?.description || "",
      winning_team_id: prize?.winning_team_id || "",
    },
  });

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

  const onSubmit = async (data: any) => {
    const { error } = prize
      ? await supabase
          .from("prizes")
          .update(data)
          .eq("id", prize.id)
      : await supabase.from("prizes").insert(data);

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
            onValueChange={(value) => form.setValue("season_id", value)}
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
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Flight A</SelectItem>
              <SelectItem value="B">Flight B</SelectItem>
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
              <SelectItem value="">Not assigned</SelectItem>
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