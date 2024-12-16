import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MapPin, Clock, Trophy, CalendarDays, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Unable to load event details. Please try again later.",
        variant: "destructive",
      });
      navigate("/");
    },
  });

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
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          
          <h1 className="text-3xl font-bold text-golf-secondary mb-6">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center text-golf-primary">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location || "Location TBA"}</span>
            </div>
            <div className="flex items-center text-golf-primary">
              <CalendarDays className="w-5 h-5 mr-2" />
              <span>{format(new Date(event.event_date), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center text-golf-primary">
              <Clock className="w-5 h-5 mr-2" />
              <span>{event.event_time ? format(new Date(`2000-01-01T${event.event_time}`), "h:mm a") : "Time TBA"}</span>
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-golf-accent" />
                  <h2 className="text-xl font-semibold">Format</h2>
                </div>
                <p className="text-golf-text">{event.format || "Format to be announced"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-golf-accent" />
                  <h2 className="text-xl font-semibold">Event Details</h2>
                </div>
                <p className="text-golf-text">{event.details || "No additional details available"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Team Scores</h2>
                {event.event_scores && event.event_scores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.event_scores.map((score: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
                      >
                        <span className="font-medium">{score.team?.name || "Unknown Team"}</span>
                        <span className="text-golf-primary font-semibold">
                          {score.score ?? "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-golf-text text-center py-4">No scores available yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;