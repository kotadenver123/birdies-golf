import { MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "completed";
  event_time?: string;
  format?: string;
  details?: string;
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
          <Card key={event.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{event.date}</p>
                {event.event_time && (
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{event.event_time}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-golf-primary">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{event.location}</span>
              </div>
              {event.format && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Format:</span> {event.format}
                </p>
              )}
              {event.details && (
                <p className="text-sm text-gray-600 line-clamp-2">{event.details}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};