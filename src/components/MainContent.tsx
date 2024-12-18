import { FlightSelector } from "./FlightSelector";
import { StandingsTable } from "./StandingsTable";
import { EventsList } from "./EventsList";
import { PrizesDisplay } from "./PrizesDisplay";
import { SponsorsCarousel } from "./SponsorsCarousel";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "completed";
  event_date: string;
  event_time: string | null;
  format: string | null;
  details: string | null;
  image_url: string | null;
  season_id: string;
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
  const seasonId = events[0]?.season_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-golf-primary">League Standings</h2>
          <FlightSelector
            currentFlight={currentFlight}
            onFlightChange={setCurrentFlight}
          />
          {isLoadingStandings ? (
            <div className="py-4">Loading standings...</div>
          ) : (
            <>
              <StandingsTable teams={standings} flight={currentFlight} />
              {seasonId && (
                <PrizesDisplay seasonId={seasonId} flight={currentFlight} />
              )}
            </>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-golf-primary">League Sponsors</h2>
          <SponsorsCarousel />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {isLoadingEvents ? (
            <div className="py-4">Loading events...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <EventsList events={upcomingEvents} type="upcoming" />
            </div>
          )}
        </div>
        <div>
          {isLoadingEvents ? (
            <div className="py-4">Loading events...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <EventsList events={pastEvents} type="past" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};