
import { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Form } from "@/components/ui/form";

type Prize = Database["public"]["Tables"]["prizes"]["Row"];

export interface PrizeFormData {
  season_id: string;
  flight: string;
  position: number;
  description: string;
  winning_team_id: string;
}

interface PrizeFormProviderProps {
  prize?: Prize;
  onSuccess: () => void;
  children: ReactNode;
}

export function PrizeFormProvider({ prize, onSuccess, children }: PrizeFormProviderProps) {
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
    <FormProvider {...form}>
      <Form>
        <form id="prize-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {children}
        </form>
      </Form>
    </FormProvider>
  );
}
