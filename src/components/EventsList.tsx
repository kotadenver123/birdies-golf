import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "completed";
}

interface EventsListProps {
  events: Event[];
  type: "upcoming" | "past";
}

export const EventsList = ({ events, type }: EventsListProps) => {
  const filteredEvents = events.filter((event) =>
    type === "upcoming"
      ? event.status === "upcoming"
      : event.status === "completed"
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-golf-secondary mb-4">
        {type === "upcoming" ? "Upcoming Events" : "Past Events"}
      </h2>
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <Link 
            key={event.id} 
            to={`/events/${event.id}`}
            className="block"
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                <div className="flex items-center text-golf-primary">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{event.location}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};