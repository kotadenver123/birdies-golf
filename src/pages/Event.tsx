import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MapPin, Clock, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Event = () => {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_scores (
            team_id,
            score,
            teams (
              name
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="min-h-screen bg-golf-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          
          <h1 className="text-3xl font-bold text-golf-secondary mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center text-golf-primary">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-golf-primary">
              <Clock className="w-5 h-5 mr-2" />
              <span>{format(new Date(event.event_date), "MMM d, yyyy")} at {event.event_time}</span>
            </div>
            <div className="flex items-center text-golf-primary">
              <Trophy className="w-5 h-5 mr-2" />
              <span>{event.format}</span>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <p className="text-golf-text">{event.details}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Team Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.event_scores?.map((score: any) => (
                  <div key={score.team_id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                    <span className="font-medium">{score.teams.name}</span>
                    <span className="text-golf-primary font-semibold">
                      {score.score ?? "-"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Event;