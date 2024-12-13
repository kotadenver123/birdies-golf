import { MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Team {
  name: string;
  players: string[];
  score: number | null;
}

interface EventDetailsProps {
  title: string;
  date: string;
  location: string;
  event_time: string;
  format: string;
  details: string;
  image_url: string;
  status: "upcoming" | "completed";
  teams?: Team[];
}

export const EventDetails = ({
  title,
  date,
  location,
  event_time,
  format,
  details,
  image_url,
  status,
  teams,
}: EventDetailsProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-lg">{location}</p>
          <span className="inline-block px-3 py-1 bg-golf-accent text-golf-secondary rounded-full text-sm font-medium mt-2">
            {status === "completed" ? "Completed" : "Upcoming"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{date} - {event_time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>{format}</span>
              </div>
              <p className="text-gray-600 mt-4">{details}</p>
            </div>
          </CardContent>
        </Card>

        {teams && teams.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Event Scores</h2>
              <div className="space-y-4">
                {teams.map((team) => (
                  <div
                    key={team.name}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-golf-secondary">{team.name}</p>
                      <p className="text-sm text-gray-500">
                        {team.players.join(" • ")}
                      </p>
                    </div>
                    <span className="text-xl font-semibold text-golf-primary">
                      {team.score ?? "-"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};