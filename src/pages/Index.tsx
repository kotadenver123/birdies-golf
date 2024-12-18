import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SeasonHeader } from "@/components/SeasonHeader";
import { MainContent } from "@/components/MainContent";
import { format, isValid } from "date-fns";

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
    if (error) {
      console.error(error);
    } else if (data) {
      const formattedEvents = data.map(event => ({
        ...event,
        date: event.event_date,
        status: event.status as "upcoming" | "completed"
      }));
      setEvents(formattedEvents);
    }
  };

  useEffect(() => {
    fetchSeasons();
    fetchEvents();
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const currentSeason = seasons.find((season) => season.id === currentSeasonId);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PP") : "";
  };

  return (
    <div>
      <SeasonHeader
        season={currentSeason?.title || ""}
        dates={`${formatDate(currentSeason?.start_date)} - ${formatDate(currentSeason?.end_date)}`}
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