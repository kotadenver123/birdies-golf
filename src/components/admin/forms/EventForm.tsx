import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { DateTimeSection } from "./sections/DateTimeSection";
import { EventDetailsSection } from "./sections/EventDetailsSection";

const EVENT_STATUS_OPTIONS = ['draft', 'published', 'cancelled'] as const;
type EventStatus = typeof EVENT_STATUS_OPTIONS[number];

interface EventFormProps {
  event?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: event?.title || "",
      season_id: event?.season_id || "",
      event_date: event?.event_date || "",
      event_time: event?.event_time || "",
      location: event?.location || "",
      status: (event?.status as EventStatus) || "draft",
      format: event?.format || "",
      details: event?.details || "",
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

  const onSubmit = async (data: any) => {
    if (!EVENT_STATUS_OPTIONS.includes(data.status as EventStatus)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid status value",
      });
      return;
    }

    const { error } = event
      ? await supabase
          .from("events")
          .update(data)
          .eq("id", event.id)
      : await supabase.from("events").insert(data);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Event saved successfully",
    });
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoSection form={form} seasons={seasons || []} />
        <DateTimeSection form={form} />
        <EventDetailsSection form={form} />

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