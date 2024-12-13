import { FlightSelector } from "./FlightSelector";
import { StandingsTable } from "./StandingsTable";
import { EventsList } from "./EventsList";
import { EventDetails } from "./EventDetails";

interface Event {
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "completed";
  event_time?: string;
  format?: string;
  details?: string;
  image_url?: string;
  teams?: Array<{
    name: string;
    players: string[];
    score: number | null;
  }>;
}

interface Team {
  position: number;
  name: string;
  players: string[];
  score: number;
}

interface MainContentProps {
  currentFlight: string;
  setCurrentFlight: (flight: string) => void;
  standings: Team[];
  events: Event[];
  isLoadingStandings: boolean;
  isLoadingEvents: boolean;
}

export const MainContent = ({
  currentFlight,
  setCurrentFlight,
  standings,
  events,
  isLoadingStandings,
  isLoadingEvents,
}: MainContentProps) => {
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "completed");

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <FlightSelector
            currentFlight={currentFlight}
            onFlightChange={setCurrentFlight}
          />
          {isLoadingStandings ? (
            <div>Loading standings...</div>
          ) : (
            <StandingsTable teams={standings} flight={currentFlight} />
          )}
        </div>
        {isLoadingEvents ? (
          <div>Loading events...</div>
        ) : (
          <>
            {events.length > 0 && (
              <EventDetails {...events[0]} />
            )}
            <EventsList events={upcomingEvents} type="upcoming" />
          </>
        )}
      </div>
      <div>
        {isLoadingEvents ? (
          <div>Loading events...</div>
        ) : (
          <EventsList events={pastEvents} type="past" />
        )}
      </div>
    </div>
  );
};