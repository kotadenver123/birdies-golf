import { CalendarDays } from "lucide-react";

interface SeasonHeaderProps {
  season: string;
  dates: string;
}

export const SeasonHeader = ({ season, dates }: SeasonHeaderProps) => {
  return (
    <div className="bg-golf-primary text-white p-6 rounded-lg shadow-lg mb-8">
      <h1 className="text-3xl font-bold mb-2">{season}</h1>
      <div className="flex items-center text-golf-accent">
        <CalendarDays className="w-5 h-5 mr-2" />
        <span>{dates}</span>
      </div>
    </div>
  );
};