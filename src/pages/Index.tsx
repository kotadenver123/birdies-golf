import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SeasonHeader } from "@/components/SeasonHeader";
import { MainContent } from "@/components/MainContent";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "completed";
  event_date: string;
  event_time: string;
  format: string;
  details: string;
  image_url: string;
  season_id: string;
}

interface Team {
  position: number;
  name: string;
  players: string[];
  score: number;
}

export default function Index() {
  const [seasons, setSeasons] = useState([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentSeasonId, setCurrentSeasonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSeasons = async () => {
    const { data, error } = await supabase.from("seasons").select("*");
    if (error) console.error(error);
    else setSeasons(data);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) console.error(error);
    else setEvents(data);
  };

  useEffect(() => {
    fetchSeasons();
    fetchEvents();
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const currentSeason = seasons.find((season) => season.id === currentSeasonId);

  return (
    <div>
      <SeasonHeader
        season={currentSeason?.title || ""}
        dates={`${format(new Date(currentSeason?.start_date), "PP")} - ${format(new Date(currentSeason?.end_date), "PP")}`}
        seasons={seasons}
        onSeasonChange={setCurrentSeasonId}
        currentSeasonId={currentSeasonId}
      />
      <MainContent
        currentFlight="A"
        setCurrentFlight={() => {}}
        standings={[]}
        events={events}
        isLoadingStandings={false}
        isLoadingEvents={false}
      />
    </div>
  );
}
