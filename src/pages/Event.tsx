import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EventHeader } from "@/components/event/EventHeader";
import { EventMetadata } from "@/components/event/EventMetadata";
import { EventFormat } from "@/components/event/EventFormat";
import { EventDetails } from "@/components/event/EventDetails";
import { EventScores } from "@/components/event/EventScores";
import { EventLoadingState } from "@/components/event/EventLoadingState";
import { EventErrorState } from "@/components/event/EventErrorState";

const Event = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      if (!id) throw new Error("Event ID is required");

      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_scores (
            score,
            team: teams (
              name
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Event not found");
      }

      return data;
    },
    enabled: !!id,
    retry: false,
  });

  const handleError = () => {
    toast({
      title: "Error",
      description: "Unable to load event details. Please try again later.",
      variant: "destructive",
    });
    navigate("/");
  };

  if (error) {
    handleError();
    return null;
  }

  if (isLoading) {
    return <EventLoadingState />;
  }

  if (!event) {
    return <EventErrorState />;
  }

  return (
    <div className="min-h-screen bg-golf-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <EventHeader 
            imageUrl={event.image_url} 
            title={event.title}
            seasonId={event.season_id}
          />
          
          <EventMetadata 
            location={event.location}
            eventDate={event.event_date}
            eventTime={event.event_time}
          />

          <div className="grid gap-6 mb-8">
            <EventFormat format={event.format} />
            <EventDetails details={event.details} />
            <EventScores scores={event.event_scores} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;