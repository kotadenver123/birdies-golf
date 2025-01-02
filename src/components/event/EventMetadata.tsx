import { MapPin, CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";

interface EventMetadataProps {
  location: string | null;
  eventDate: string;
  eventTime: string | null;
}

export const EventMetadata = ({ location, eventDate, eventTime }: EventMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="flex items-center text-golf-primary">
        <MapPin className="w-5 h-5 mr-2" />
        <span>{location || "Location TBA"}</span>
      </div>
      <div className="flex items-center text-golf-primary">
        <CalendarDays className="w-5 h-5 mr-2" />
        <span>{format(new Date(eventDate), "MMMM d, yyyy")}</span>
      </div>
      <div className="flex items-center text-golf-primary">
        <Clock className="w-5 h-5 mr-2" />
        <span>{eventTime ? format(new Date(`2000-01-01T${eventTime}`), "h:mm a") : "Time TBA"}</span>
      </div>
    </div>
  );
};