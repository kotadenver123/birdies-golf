import { useState } from "react";
import { SeasonHeader } from "@/components/SeasonHeader";
import { MainContent } from "@/components/MainContent";
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
    id: event.id,
    title: event.title,
    date: format(new Date(event.event_date), "MMM d, yyyy"),
    location: event.location ?? "TBD",
    status: event.status as "upcoming" | "completed",
    event_date: event.event_date,
    event_time: event.event_time,
    format: event.format,
    details: event.details,
    image_url: event.image_url
  }));

  return (
    <div className="min-h-screen bg-golf-background">
      <div className="container mx-auto px-4 py-8">
        <SeasonHeader
          season={currentSeason.title}
          dates={formatDateRange(currentSeason.start_date, currentSeason.end_date)}
        />
        <MainContent
          currentFlight={currentFlight}
          setCurrentFlight={setCurrentFlight}
          standings={standings}
          events={mappedEvents}
          isLoadingStandings={standingsLoading}
          isLoadingEvents={eventsLoading}
        />
      </div>
    </div>
  );
};

export default Index;