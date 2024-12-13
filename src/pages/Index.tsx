import { useState } from "react";
import { SeasonHeader } from "@/components/SeasonHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { EventsList } from "@/components/EventsList";

const Index = () => {
  const [currentFlight, setCurrentFlight] = useState("A");

  // Mock data - replace with real data later
  const mockTeams = [
    {
      position: 1,
      name: "Eagle Warriors",
      players: ["John", "Mike", "Jared", "Phil"],
      score: 72,
    },
    {
      position: 2,
      name: "Sand Trappers",
      players: ["John", "Mike", "Jared", "Phil"],
      score: 73,
    },
    {
      position: 3,
      name: "Birdie Kings",
      players: ["John", "Mike", "Jared", "Phil"],
      score: 74,
    },
  ];

  const mockEvents = [
    {
      title: "Spring Championship",
      date: "Mar 19, 2024 - Mar 20, 2024",
      location: "Pine Valley Golf Club",
      status: "upcoming" as const,
    },
    {
      title: "Masters Weekend",
      date: "Mar 14, 2024 - Mar 16, 2024",
      location: "Augusta National",
      status: "completed" as const,
    },
    {
      title: "Coastal Classic",
      date: "Mar 9, 2024",
      location: "Pebble Beach",
      status: "completed" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-golf-background">
      <div className="container py-8">
        <SeasonHeader
          season="Winter League 2024"
          dates="January 2024 - March 2024"
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
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
              <StandingsTable teams={mockTeams} flight={currentFlight} />
            </div>
            <EventsList events={mockEvents} type="upcoming" />
          </div>
          <div>
            <EventsList events={mockEvents} type="past" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;