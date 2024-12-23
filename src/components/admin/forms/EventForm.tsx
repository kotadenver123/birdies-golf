import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { DateTimeSection } from "./sections/DateTimeSection";
import { EventDetailsSection } from "./sections/EventDetailsSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EVENT_STATUS_OPTIONS = ['upcoming', 'completed', 'in_progress'] as const;
type EventStatus = typeof EVENT_STATUS_OPTIONS[number];

interface EventFormProps {
  event?: any;
  onSuccess: () => void;
  onCancel: () => void;
  defaultSeasonId?: string;
}

export default function EventForm({ event, onSuccess, onCancel, defaultSeasonId }: EventFormProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: event?.title || "",
      season_id: event?.season_id || defaultSeasonId || "",
      event_date: event?.event_date || "",
      event_time: event?.event_time || "",
      location: event?.location || "",
      status: (event?.status as EventStatus) || "upcoming",
      format: event?.format || "",
      details: event?.details || "",
      image_url: event?.image_url || "",
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

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image",
      });
      return null;
    }

    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (data: any) => {
    let imageUrl = data.image_url;

    // Handle file upload if a new file is selected
    const imageInput = document.querySelector<HTMLInputElement>('#image-upload');
    if (imageInput?.files?.length) {
      const uploadedUrl = await handleImageUpload(imageInput.files[0]);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    // Validate status value
    if (!EVENT_STATUS_OPTIONS.includes(data.status as EventStatus)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid status value",
      });
      return;
    }

    const finalData = {
      ...data,
      image_url: imageUrl,
    };

    const { error } = event
      ? await supabase
          .from("events")
          .update(finalData)
          .eq("id", event.id)
      : await supabase.from("events").insert(finalData);

    if (error) {
      console.error("Error saving event:", error);
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

        <div className="space-y-2">
          <Label htmlFor="image-upload">Event Image</Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="cursor-pointer"
          />
          {form.watch("image_url") && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Current Image URL:</p>
              <Input
                type="text"
                {...form.register("image_url")}
                placeholder="Image URL"
              />
            </div>
          )}
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