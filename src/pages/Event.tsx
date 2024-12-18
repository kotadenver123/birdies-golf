import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { EventHeader } from "@/components/event/EventHeader";
import { EventMetadata } from "@/components/event/EventMetadata";
import { EventFormat } from "@/components/event/EventFormat";
import { EventDetails } from "@/components/event/EventDetails";
import { EventScores } from "@/components/event/EventScores";

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
    return (
      <div className="min-h-screen bg-golf-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="w-full h-64 rounded-lg" />
            <Skeleton className="w-2/3 h-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-golf-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-golf-secondary mb-2">Event Not Found</h2>
          <p className="text-golf-text">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
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