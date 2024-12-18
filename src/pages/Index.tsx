import { useState, useEffect } from "react";
import { SeasonHeader } from "@/components/SeasonHeader";
import { MainContent } from "@/components/MainContent";
import { format, isValid } from "date-fns";
import { useSeasons } from "@/hooks/useSeasons";
import { useEvents } from "@/hooks/useEvents";
import { useTeamStandings } from "@/hooks/useTeamStandings";
import { useSearchParams } from "react-router-dom";

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

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentFlight, setCurrentFlight] = useState("A");
  
  const { data: seasons = [], isLoading: isLoadingSeasons } = useSeasons();
  
  // Get seasonId from URL or use empty string
  const urlSeasonId = searchParams.get("seasonId");
  const [currentSeasonId, setCurrentSeasonId] = useState<string>(urlSeasonId || "");

  const { data: events = [], isLoading: isLoadingEvents } = useEvents(currentSeasonId);
  const { data: standings = [], isLoading: isLoadingStandings } = useTeamStandings(
    currentSeasonId,
    currentFlight
  );

  // Set initial season if none selected
  useEffect(() => {
    if (!currentSeasonId && seasons.length > 0 && !isLoadingSeasons) {
      const initialSeasonId = seasons[0].id;
      setCurrentSeasonId(initialSeasonId);
      setSearchParams({ seasonId: initialSeasonId });
    }
  }, [seasons, isLoadingSeasons, currentSeasonId, setSearchParams]);

  // Update URL when season changes
  const handleSeasonChange = (seasonId: string) => {
    setCurrentSeasonId(seasonId);
    setSearchParams({ seasonId });
  };

  const currentSeason = seasons.find((season) => season.id === currentSeasonId);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PP") : "";
  };

  if (isLoadingSeasons) {
    return <div className="container mx-auto px-4 py-8">Loading seasons...</div>;
  }

  return (
    <div>
      <SeasonHeader
        season={currentSeason?.title || ""}
        dates={`${formatDate(currentSeason?.start_date)} - ${formatDate(currentSeason?.end_date)}`}
        seasons={seasons}
        onSeasonChange={handleSeasonChange}
        currentSeasonId={currentSeasonId}
      />
      <MainContent
        currentFlight={currentFlight}
        setCurrentFlight={setCurrentFlight}
        standings={standings}
        events={events}
        isLoadingStandings={isLoadingStandings}
        isLoadingEvents={isLoadingEvents}
      />
    </div>
  );
}