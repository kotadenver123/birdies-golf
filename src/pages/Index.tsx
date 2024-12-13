import { useState } from "react";
import { SeasonHeader } from "@/components/SeasonHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { EventsList } from "@/components/EventsList";
import { useSeasons } from "@/hooks/useSeasons";
import { useEvents } from "@/hooks/useEvents";
import { useTeamStandings } from "@/hooks/useTeamStandings";
import { format } from "date-fns";

const Index = () => {
  const [currentFlight, setCurrentFlight] = useState("A");
  const { data: seasons, isLoading: seasonsLoading } = useSeasons();
  const currentSeason = seasons?.[0];

  const { data: events = [], isLoading: eventsLoading } = useEvents(
    currentSeason?.id ?? ""
  );

  const { data: standings = [], isLoading: standingsLoading } = useTeamStandings(
    currentSeason?.id ?? "",
    currentFlight
  );

  if (seasonsLoading) {
    return <div>Loading seasons...</div>;
  }

  if (!currentSeason) {
    return <div>No seasons found</div>;
  }

  const formatDateRange = (start: string, end: string) => {
    return `${format(new Date(start), "MMMM yyyy")} - ${format(
      new Date(end),
      "MMMM yyyy"
    )}`;
  };

  const mappedEvents = events.map((event) => ({
    title: event.title,
    date: format(new Date(event.event_date), "MMM d, yyyy"),
    location: event.location ?? "TBD",
    status: event.status as "upcoming" | "completed",
  }));

  return (
    <div className="min-h-screen bg-golf-background">
      <div className="container mx-auto px-4 py-8">
        <SeasonHeader
          season={currentSeason.title}
          dates={formatDateRange(currentSeason.start_date, currentSeason.end_date)}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => setCurrentFlight("A")}
                  className={`px-4 py-2 rounded ${
                    currentFlight === "A"
                      ? "bg-golf-primary text-white"
                      : "bg-white text-golf-primary"
                  }`}
                >
                  Flight A
                </button>
                <button
                  onClick={() => setCurrentFlight("B")}
                  className={`px-4 py-2 rounded ${
                    currentFlight === "B"
                      ? "bg-golf-primary text-white"
                      : "bg-white text-golf-primary"
                  }`}
                >
                  Flight B
                </button>
              </div>
              {standingsLoading ? (
                <div>Loading standings...</div>
              ) : (
                <StandingsTable teams={standings} flight={currentFlight} />
              )}
            </div>
            {eventsLoading ? (
              <div>Loading events...</div>
            ) : (
              <EventsList
                events={mappedEvents.filter((e) => e.status === "upcoming")}
                type="upcoming"
              />
            )}
          </div>
          <div>
            {eventsLoading ? (
              <div>Loading events...</div>
            ) : (
              <EventsList
                events={mappedEvents.filter((e) => e.status === "completed")}
                type="past"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;