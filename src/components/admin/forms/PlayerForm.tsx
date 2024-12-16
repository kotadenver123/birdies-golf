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

interface PlayerFormProps {
  player?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PlayerForm({ player, onSuccess, onCancel }: PlayerFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      name: player?.name || "",
      email: player?.email || "",
      handicap: player?.handicap || "",
    },
  });

  const onSubmit = async (data: any) => {
    const { error } = player
      ? await supabase
          .from("players")
          .update(data)
          .eq("id", player.id)
      : await supabase.from("players").insert(data);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save player",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Player saved successfully",
    });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="handicap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handicap</FormLabel>
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